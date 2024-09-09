import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body: {
    oid: string;
    order_id: string;
    payment_id: string;
    signature: string;
    RZKey: string;
    cid: string;
    kpapi: string;
  } = await req.json();
  if (!body) {
    return NextResponse.json({ message: "Invalid Request" });
  }
  const res = await axios.post(
    "https://karmapay-backend.app.k8s.coffeecodes.in/v1/payment/verify",
    {
      order_id: body.order_id,
      payment_id: body.payment_id,
      signature: body.signature,
      RZKey: body.RZKey,
      cid: body.cid,
      oid: body.oid,
    },
    {
      headers: {
        Authorization: "Bearer " + body.kpapi,
      },
    },
  );
  if (res.data.status) {
    return NextResponse.json({
      message: "Payment Successful",
      status: res.data.status,
    });
  }
  return NextResponse.json({
    message: "Payment Failed",
    status: res.data.status,
  });
}
