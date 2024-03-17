export const createPrice = async (currency: string, amount: number, stripe_secret_key: string) => {
    const stripe = require('stripe')(stripe_secret_key);

    const price = await stripe.prices.create({
    currency: currency,
    unit_amount: amount * 100,
    product_data: {
        name: 'Gold Plan',
    },
    });
    console.log(price);
    return price;
}