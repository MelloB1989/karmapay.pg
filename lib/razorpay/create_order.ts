/**
 * Razorpay Library
 * AUTHOR: MELLOB
 * @param {string} key
 * @param {string} secret
 * @param {string} order_amt
 * @param {string} order_id
 * @param {string} order_description
 */

const Razorpay = require("razorpay");

export const createRazorpayOrder = async (key: string, secret: string, order_amt: number, order_id: string, order_description: string) => {
    var razorpay = new Razorpay({
        key_id: key,
        key_secret: secret,
      });
      const order = await razorpay.orders.create({
        "amount": order_amt.toString()+"00",
        "currency": "INR",
        "receipt": order_id,
        "notes": {
          "description": order_description
        }
        });
        return order;
}