export interface OrderDetails{
    PGorder: any;
    api_key: string;
    email: string;
    kpapi: string;
    order_amt: number;
    order_cid: string;
    order_currency: string;
    order_description: string;
    order_mode: string;
    order_status: string;
    redirect_url: string;
    registration: string;
    subdomain: string;
    timestamp: string;
    uid: string;
    webhook_url: string;
}

export interface RazorpayOrder {
    amount: number,
    amount_due: number,
    amount_paid: number,
    attempts: number,
    created_at: number,
    currency: string;
    entity: string;
    id: string;
    notes: {
      description: string;
    },
    offer_id: string;
    receipt: string;
    status: string;
}

export interface PhonepeOrder {
    url: string;
}

export interface StripeOrder{
    price: {
        active: boolean;
        billing_scheme: string;
        created: number;
        currency: string;
        custom_unit_amount: any;
        id: string;
        livemode?: false,
        lookup_key: any;
        metadata: any;
        nickname: any;
        object: string;
        product: string;
        recurring: any;
        tax_behavior: string;
        tiers_mode: any;
        transform_quantity: any;
        type: string;
        unit_amount: number;
        unit_amount_decimal: string;
      },
      url: string;
}

export interface RazorpayAPI {
    key: string;
    secret: string;
    id: string;
}

export interface PhonepeAPI {
    salt_key: string;
    salt_index: string;
    merchant_id: string;
    merchant_user_id: string;
    id: string;
}

export interface StripeAPI{
    key: string;
    secret: string;
    id: string;
}