import { createClient } from "redis";
import dotenv from 'dotenv';
import { OrderDetails, RazorpayAPI, RazorpayOrder, PhonepeAPI, PhonepeOrder, StripeAPI, StripeOrder } from "@/app/types";
dotenv.config();
import { createRazorpayOrder } from '@/lib/razorpay/create_order';
import { createPhonepeOrder } from '@/lib/phonepe/create_order';
import { createPrice } from '@/lib/stripe/create_price';
import { createCheckoutSession } from '@/lib/stripe/create_checkout_session';

interface Params {
    order_id: string;
  }

const client = createClient ({
    url : process.env.REDIS_ENDPOINT //|| env.REDIS_ENDPOINT,
  });
  
  client.on("error", function(err) {
      throw err;
  });

export default async function PaymentPage({ order_id }: Params){
    let orderDetails: OrderDetails = {
        PGorder: "",
        api_key: "",
        email: "",
        kpapi: "",
        order_amt: 0,
        order_cid: "",
        order_currency: "",
        order_description: "",
        order_mode: "",
        order_status: "",
        redirect_url: "",
        registration: "",
        subdomain: "",
        timestamp: "",
        uid: "",
        webhook_url: "",
    };
    let makeC = true;
    let PGorder = {}
    let paymentUrl = "";
    client.connect();
    //Fetch orderDetails from redis and parse it
    const result = await client.get(order_id);
    if (result !== null) {
        orderDetails = JSON.parse(result);
    } else {
        throw new Error(`No order found with id: ${order_id}`);
    }

    if(orderDetails.order_status === "PENDING"){
        switch (orderDetails.order_mode){
            case "RAZORPAY":
                let PGRapi: RazorpayAPI = JSON.parse(Buffer.from(orderDetails.api_key.substring(3), 'base64').toString('ascii'));
                //Create a Razorpay order
                const razorpayOrder = await createRazorpayOrder(PGRapi.key, PGRapi.secret, orderDetails.order_amt, order_id, orderDetails.order_description);
                let PGO: RazorpayOrder = razorpayOrder;
                PGorder = PGO;
                orderDetails.PGorder = PGO;
                orderDetails.order_status = "CREATED";
                await client.set(order_id, JSON.stringify(orderDetails));
                break;
            
            case "PHONEPE":
                let PGPapi: PhonepeAPI = JSON.parse(Buffer.from(orderDetails.api_key.substring(3), 'base64').toString('ascii'));
                const phonepeOrder = await createPhonepeOrder(PGPapi, orderDetails.order_amt, orderDetails.redirect_url, orderDetails.subdomain, order_id);
                //console.log(phonepeOrder);
                if (phonepeOrder === null){
                    throw new Error(`Error creating Phonepe order for order_id: ${order_id}`);
                }
                paymentUrl = phonepeOrder.url;
                //console.log(paymentUrl);
                orderDetails.PGorder = {url: phonepeOrder.url};
                orderDetails.order_status = "CREATED";
                await client.set(order_id, JSON.stringify(orderDetails));
                break;

            case "STRIPE":
                let PGSapi: StripeAPI = JSON.parse(Buffer.from(orderDetails.api_key.substring(3), 'base64').toString('ascii'));
                const price = await createPrice(orderDetails.order_currency, orderDetails.order_amt, PGSapi.secret);
                const checkoutSession = await createCheckoutSession(orderDetails.subdomain, price.id, orderDetails.email, PGSapi.secret, order_id);
                let PGSO: StripeOrder = {
                    url: checkoutSession.url,
                    price
                };
                //Update the Redis order
                PGorder = PGSO;
                orderDetails.PGorder = PGSO;
                orderDetails.order_status = "CREATED";
                await client.set(order_id, JSON.stringify(orderDetails));
                break;

            default:
                console.log("Invalid order mode");
                break;
        }
    } else {
        switch(orderDetails.order_mode){
            case "RAZORPAY":
                let PGO: RazorpayOrder = orderDetails.PGorder;
                PGorder = PGO;
                break;
            case "PHONEPE":
                paymentUrl = orderDetails.PGorder.url;
                let PPO: PhonepeOrder = {
                    url: paymentUrl
                }
                PGorder = PPO;
                break;
            case "STRIPE":
                let PGSO: StripeOrder = orderDetails.PGorder;
                PGorder = PGSO;
                break;
            default:
                console.log("Invalid order mode");
                break;
        }
    }

}