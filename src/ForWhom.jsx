import { Field, RadioGroup, Flex, Button, Checkbox, Text, Box } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";
// import { useEffect } from 'react';
// import { ndhash, wrapString, wrap } from './Asymmetric.js';
// import { makeMaster } from './Asymmetric.js';
// import { passEncryptPrivate } from './Asymmetric.js';

function ForWhom() {
  const { data, setData } = useDataStore();
  

//   useEffect(() => {
//     passEncryptPrivate(
//       'monkey123', 
//       'test', 
//       'eyJjcnYiOiJYMjU1MTkiLCJkIjoicDRHOW1Qb0I0eFdDV1BlYTZpYUNsdm4tWU9ub0pRb3hONHhnLXNPc2xyayIsImV4dCI6dHJ1ZSwia2V5X29wcyI6WyJkZXJpdmVLZXkiXSwia3R5IjoiT0tQIiwieCI6IjRCLU5nVFc2NXJTa3dyNTFwdFJGT0JxZ251Y24zQWpBY0FFV24wS3k3VDAifQ==',
//       data.pubMaster
//     );
//   }, []);
 
  
//   useEffect(() => {
//     makeMaster();
// //     console.log(pubM);
// //     console.log(privM);
//     console.log('---');
//   }, []);  


  // also use local-pass-hash.py 
  // pass gets hashed on both front and back end. z
//   const setupUser = async (pass, username) => {
//     let [s, h] = await ndhash('monkey123', 32, wrapString('test' + 'VhG6X+fEw5zGGFxW'));
//     console.log(wrap(h));
// 
// 
//   }

//   useEffect(() => {
//     setupUser('monkey123', 'test');
//   }, []);

  const radioUpdate = (field, value) => { 
    setData({
      ...data,    
      [field] : value,
    }); 
  };

  const checkboxUpdate = (field, isChecked) => { 
    setData({
      ...data,
      [field] : isChecked,
    }); 
  };

  const checkboxDisasterUpdate = (field, isChecked) => { 
    setData({
      ...data,
      disaster : {
        ...data.disaster, 
        [field] : isChecked,
      }
    }); 
  };
  
  const next = () => {
    setData({
      ...data,
      page : 'you',
    });
  };  
  
  const admin = () => {
    setData({
      ...data,
      page : 'login'
    });
  };

  return (
    <>
      <section id="for-whom">
        <Flex direction="column">        
          <Box bg="bg" shadow="lg" borderRadius="lg" style={{textAlign: 'left'}} m='8' p='4'>
            <p style={{textAlign: 'left', padding: 5}}>
              Disclaimer: Thank you for sharing what you need with us. We are a group of
              random individuals volunteering to support each other. We are not a non-profit
              institution or grant-funded or government-funded entity. Our funds primarily
              come from people donating. <strong>We cannot guarantee support</strong> &mdash; 
              financial or otherwise. We will do our best to help in whatever way we can as 
              a community.
            </p>
            <Checkbox.Root variant='outline' checked={data.agree}
              onCheckedChange={ (state) => { checkboxUpdate("agree", state.checked); } }
              justify="flex-start" pl="8" mt='4'>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                I acknowledge the limitations of this project. 
                <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span>
              </Checkbox.Label>
            </Checkbox.Root>
            <Text fontWeight="light" style={{color: 'grey'}} mt='4'>
              (To get involved in providing aid, send us an email: <a style={{color: "teal"}} href="mailto:info@trianglemutualaid.org">info@trianglemutualaid.org</a>. 
              To make a donation, see <a style={{color: "teal"}} href="trianglemutualaid.org">our website</a>.)
            </Text>
            <Text mt="4" style={{textAlign: 'left'}}>
              <strong>Outside Resources</strong> <a href="https://drive.proton.me/urls/YKCS95JX4C#zd9402Y34kxJ" style={{color: "teal"}}>This link
              will take you to a list of other resources in the area we are aware of.</a>
            </Text>             
          </Box>
        </Flex>
      
      
        <Field.Root  p='8'>
          <Field.Label>
            I am filling out this form for: 
            <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span>
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.forWhom} 
          onValueChange={ (state) => radioUpdate('forWhom', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='myself' value='myself' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Myself &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</RadioGroup.ItemText>
            </RadioGroup.Item>
  
            <RadioGroup.Item key='them' value='them' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Someone Else</RadioGroup.ItemText>
            </RadioGroup.Item>   
          </Flex>       
        </RadioGroup.Root>
      </section>
      
      <Button colorPalette="green" variant="solid" mt="8" mb="100" onClick={next}
        disabled={("" === data.forWhom || !data.agree)}>
        Continue <RiArrowRightLine />
      </Button> 
      
      { ("" === data.forWhom || !data.agree) &&
        <Text textStyle="sm" fontWeight="light" style={{color: "#ef4444"}} mt="3">
          complete all required fields, marked with a red asterisk, to continue
        </Text>
      }
      
      <div style={{height: 100}}>
        &nbsp;
      </div>
      
      <Button colorPalette="gray" variant="outline" mt="8" mb="100" onClick={admin}>
        Admin Login <RiArrowRightLine />
      </Button> 
      
      <div style={{height: 100}}>
        &nbsp;
      </div>
    </>  
  );

}

export default ForWhom;