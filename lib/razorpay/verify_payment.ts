const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");

const VerifyPayment = async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, secret: string) => {
    let validity = null;
    try{
        validity = await validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, secret);
    } catch(e){
        console.log(e);
    }
    return validity;
}

module.exports = VerifyPayment;