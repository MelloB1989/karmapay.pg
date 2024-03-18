"use client";
import { Providers } from '@/provider'
import { useState, useEffect } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import Popup from './Popup';
import axios from 'axios';
import { OrderDetails, PhonepeOrder, RazorpayOrder, StripeOrder, PG } from '@/app/types';
import {
    Box,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    useBreakpointValue,
    IconProps,
    Icon,
    Center,
    useColorModeValue,
    Image,
    Spinner
  } from '@chakra-ui/react';

  const Blur = (props: IconProps) => {
    return (
      <Icon
        width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
        zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
        height="560px"
        viewBox="0 0 528 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <circle cx="71" cy="61" r="111" fill="#F56565" />
        <circle cx="244" cy="106" r="139" fill="#ED64A6" />
        <circle cy="291" r="139" fill="#ED64A6" />
        <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
        <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
        <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
        <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
      </Icon>
    )
  }

  const PaymentProgress = ({amount}: {amount: string})=>{
    return (
        <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(https://noobsverse-internal.s3.ap-south-1.amazonaws.com/karmapay-removebg-preview.png)`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={'https://noobsverse-internal.s3.ap-south-1.amazonaws.com/karmapay-removebg-preview.png'}
            alt="#"
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            KarmaPay Payments
          </Text>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'xl'}>
              Total amount: {amount}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
    )
  }

  function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

export default function Register({makeC, PGorder, orderDetails}: {makeC: any, PGorder: PhonepeOrder | RazorpayOrder | StripeOrder | PG, orderDetails: OrderDetails}){
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [terms, setTerms] = useState(false);
    const [makec, setMakeC] = useState(makeC ? "make" : "pay");
    const [cid, setCID] = useState("");
    const [paymentg, setPaymentG] = useState("");

    useEffect(()=>{
        console.log(makec)
    }, [makec])

    //Check if cid cookie exists
    useEffect(() => {
      console.log(orderDetails.registration)
        if((orderDetails.order_mode === "STRIPE") && 'url' in PGorder) setMakeC("stripe");//window.location.href = PGorder.url;
        const cookies = document.cookie.split("; ");
        let _cid = "";
        cookies.forEach((cookie) => {
          const [key, value] = cookie.split("=");
          if(key === "cid") _cid = value;
        });
        if(_cid !== "" && orderDetails.order_mode !== "STRIPE"){ 
          setMakeC("pay");
          setCID(_cid);
        }
        if(orderDetails.registration === "no" && orderDetails.order_mode !== "STRIPE") setMakeC("pay");
      }, []);

      useEffect(()=>{
        console.log(makec);
      }, [makec]);

    const handleCRegister = async () => {
        if(!lname || !fname || !email || !phone)
          toast.error("Please fill all the details");
        if(!terms) toast.error("Please agree to the terms and conditions");
        else{
          const id = toast.loading("Registering customer...");
          const res = await axios.post("https://karmapay.live/api/v1/customer/register", {
            first_name: fname,
            last_name: lname,
            email: email,
            phone: phone,
            uid: orderDetails.uid
          }, {
            headers: {
              "Authorization": "Bearer "+orderDetails.kpapi
            }
          });
          if(res.status === 200){
            toast.success("Customer registered successfully");
            toast.dismiss(id)
            console.log("CID",res.data.data.createCustomer.cid)
            setCID(res.data.data.createCustomer.cid);
            //Set cid, name, email, phone as cookies
            document.cookie = `cid=${encodeURIComponent(res.data.data.createCustomer.cid)}; max-age=${86400 * 30}; path=/`;
            document.cookie = `name=${encodeURIComponent(fname+" "+lname)}; max-age=${86400 * 30}; path=/`;
            document.cookie = `email=${encodeURIComponent(email)}; max-age=${86400 * 30}; path=/`;
            document.cookie = `phone=${encodeURIComponent(phone)}; max-age=${86400 * 30}; path=/`;
            setMakeC("pay");
          }
          else{
            toast.error("Could not register customer");
            toast.dismiss(id);
          }
        }
      }

    return(
        <Providers>
        <Box position={'relative'}>
        <Container
          as={SimpleGrid}
          maxW={'7xl'}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}>
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
              Payments powered by{' '}
              <Text size='4xl' as={'span'} bgGradient="linear(to-r, orange.200,pink.300)" bgClip="text">
                KarmaPay
              </Text>{' '}
            </Heading>
            <Stack direction={'row'} spacing={4} align={'center'}>
              <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
                The Karma Project
              </Text>
            </Stack>
          </Stack>
          
          {
            makec === "pay" ? (<PaymentProgress amount={orderDetails.order_amt.toString()} />) :  makec === "register" ? (
                <Stack
            bg={'gray.50'}
            rounded={'xl'}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: 'lg' }}>
            <Stack spacing={4}>
              <Heading
                color={'gray.800'}
                lineHeight={1.1}
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                Please fill in your details for payment
                <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                  
                </Text>
              </Heading>
              <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                We will collect basic identification details like your email, name, phone for verification of your payment. Your payment details are not shared with any third-party.
              </Text>
            </Stack>
            <Box as={'form'} mt={10}>
              <Stack spacing={4}>
                <Input
                  placeholder="Your full name"
                  bg={'gray.100'}
                  border={0}
                  color={'gray.500'}
                  _placeholder={{
                    color: 'gray.500',
                  }}
                />
                <Input
                  placeholder="Your email"
                  bg={'gray.100'}
                  border={0}
                  color={'gray.500'}
                  _placeholder={{
                    color: 'gray.500',
                  }}
                />
                <Input
                  placeholder="Your phone"
                  bg={'gray.100'}
                  border={0}
                  color={'gray.500'}
                  _placeholder={{
                    color: 'gray.500',
                  }}
                />
              </Stack>
              <Button
                fontFamily={'heading'}
                mt={8}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                _hover={{
                  bgGradient: 'linear(to-r, red.400,pink.400)',
                  boxShadow: 'xl',
                }}>
                Continue Payment
              </Button>
            </Box>
            form
          </Stack>
            ) : makec === "stripe" ? (<Popup url={'url' in PGorder ? PGorder.url : "/"} />) : (<Spinner size='xl' thickness="8px"/>)
          }

        </Container>
        <Blur position={'absolute'} bottom={-20} left={-30} style={{ filter: 'blur(70px)' }} />
      </Box>
        <Toaster/>
        </Providers>
    )
}