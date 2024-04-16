const axios = require('axios');
import * as crypto from 'crypto';
import { PhonepeAPI } from '@/app/types';

export const createPhonepeOrder = async(PGPapi: PhonepeAPI, amount: number, webhook: string, subdomain: string, oid: string) => {
    const data = {
        merchantId: PGPapi.merchant_id,
        merchantTransactionId: oid.substring(0, 35),
        merchantUserId: PGPapi.merchant_user_id,
        amount: amount * 100,
        redirectUrl: `https://${subdomain}/success/${oid}`,
        redirectMode: "POST",
        callbackUrl: webhook,
        //mobileNumber: "9825454588",
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const payloadMain = Buffer.from(JSON.stringify(data)).toString('base64');

  // Compute the X-VERIFY value
  const checksum = crypto.createHash('sha256')
    .update(`${payloadMain}/pg/v1/pay${PGPapi.salt_key}`)
    .digest('hex') + `###${PGPapi.salt_index}`;

  try {
    const response = await axios.post('https://api.phonepe.com/apis/hermes/pg/v1/pay', {
      request: payloadMain,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'Accept': 'application/json',
      },
    });

    // Handle redirection to the payment URL
    const paymentUrl = response.data.data.instrumentResponse.redirectInfo.url;
    return {url: paymentUrl};
  } catch (error) {
    console.error('Error:', error);
    return null;
}
}