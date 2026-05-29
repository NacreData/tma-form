import { Field, RadioGroup, Flex, Button, Checkbox, Text, Box } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";
// import { useEffect } from 'react';
// import { makeMaster } from './Asymmetric.js';

function ForWhom() {
  const { data, setData } = useDataStore();
  
  
  
//   useEffect(() => {
//     makeMaster();
// //     console.log(pubM);
// //     console.log(privM);
//     console.log('---');
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

  return (
    <>
      <section id="for-whom">
        <Flex direction="column">        
          <Box bg="bg" shadow="lg" borderRadius="lg" style={{textAlign: 'left'}} m='8' p='4'>
            <Text size="lg">
              For testers: The following bit would probably be done on the backend or 
              perhaps in a different admin interface in real life, but for now, go ahead 
              and choose which type of disaster we are dealing with for this form: 
            </Text>
            
            <Checkbox.Root variant='outline' checked={data.disaster.flood}
              onCheckedChange={ (state) => { checkboxDisasterUpdate("flood", state.checked); } }
              justify="flex-start" pl="8" mt='4'>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Flood</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root variant='outline' checked={data.disaster.storm}
              onCheckedChange={ (state) => { checkboxDisasterUpdate("storm", state.checked); } }
              justify="flex-start" pl="8" mt='4'>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Storm</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root variant='outline' checked={data.disaster.snow}
              onCheckedChange={ (state) => { checkboxDisasterUpdate("snow", state.checked); } }
              justify="flex-start" pl="8" mt='4'>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Snow/Ice</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root variant='outline' checked={data.disaster.heat}
              onCheckedChange={ (state) => { checkboxDisasterUpdate("heat", state.checked); } }
              justify="flex-start" pl="8" mt='4'>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Heat</Checkbox.Label>
            </Checkbox.Root>
            
          </Box>
        
          
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
            <Checkbox.Label>I acknowledge the limitations of this project.</Checkbox.Label>
          </Checkbox.Root>
          <Text fontWeight="light" style={{color: 'grey'}} mt='4'>
            (To get involved in providing aid, send us an email: <a href="mailto:info@trianglemutualaid.org">info@trianglemutualaid.org</a>. 
            To make a donation, see <a href="trianglemutualaid.org">our website</a>.)
          </Text>
        </Flex>
      
      
        <Field.Root  p='8'>
          <Field.Label>
            I am filling out this form for:
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
      
      <div style={{height: 150}}>
        &nbsp;
      </div>
    </>  
  );

}

export default ForWhom;