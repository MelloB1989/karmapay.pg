import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();
import { OrderDetails } from "@/app/types";
import axios from "axios";
import { Providers } from "@/provider";
import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";

let orderDetails: OrderDetails = {
  PGorder: "",
  api_key: "",
  email: "",
  kpapi: "",
  order_amt: 0,
  verify_url: "",
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

interface PageProps {
  params: {
    oid: string;
  };
}
if (!process.env.UPSTASH_URL || !process.env.UPSTASH_TOKEN) {
  throw new Error("No Upstash URL or token provided");
}
const client = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
});

export default async function SuccessPage({ params }: PageProps) {
  const { oid } = params;
  try {
    const result: any = await client.get(oid.toString());
    orderDetails = result;

    //Trigger webhook
    //await axios.post(orderDetails.webhook_url, orderDetails);
    //Delete order from redis
    await client.del(oid.toString());
  } catch (error) {
    console.error("Error:", error);
  }

  return (
    <Providers>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ md: "6xl" }}
            lineHeight={"110%"}
            color={"green.400"}
          >
            <br />
            <Text as={"span"} color={"orange.400"}>
              Payment
            </Text>
            <br />
            <Text as={"span"} color={"orange.100"}>
              Successful!
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              KarmaPay Payments
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            You can now close this window and return to the merchant site.
          </Text>
        </Stack>
      </Container>
    </Providers>
  );
}
