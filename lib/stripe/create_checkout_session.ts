export const createCheckoutSession = async (order_domain: string, price_id: string, customer_email: string, stripe_secret_key: string, oid: string) => {
    const stripe = require('stripe')(stripe_secret_key);
    try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          customer_email: customer_email,
          billing_address_collection: 'auto',
          shipping_address_collection: {
            allowed_countries: ['US', 'CA'],
          },
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: price_id,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `https://karmapay.live/api/v1/payment/success?mode=stripe&oid=${oid}`,
          cancel_url: `http://${order_domain}/?canceled=true`,
        });
        //console.log(session);
        return session;
      } catch (err) {
        console.log(err);
        return {
            error: err,
        }
      }
}
