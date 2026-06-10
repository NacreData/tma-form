import { Field, Flex, Button, Input, RadioGroup, Checkbox, Grid, GridItem } from "@chakra-ui/react";
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";
import { useEffect } from 'react';

function ContactInfo() {
  const { data, setData } = useDataStore();

  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      [field] : value,
    }); 
  };

  const checkboxUpdate = (field, isChecked) => { 
    setData({
      ...data,
      them : {
        ...data.them,
        [field] : isChecked,
      },      
    }); 
  };

  const textUpdate = (evt) => {
    setData({
      ...data,
      them : {
        ...data.them,
        [event.target.name] : evt.target.value,
      },      
    }); 
  };
  
  if ("me" === data.contact) { return (<></>); }
  else {
    return (
      <>
        <section id="phone">
          <Field.Root  p='8'>
            <Field.Label>
              Phone Number:
            </Field.Label>
            <Input placeholder="What is their phone number?" name="phone" value={data.them.phone}
              onChange={textUpdate} />
          </Field.Root>
          <Flex direction="column"> 
            <Checkbox.Root variant='outline' checked={data.them.canText}  mb='8'
              onCheckedChange={ (state) => { checkboxUpdate("canText", state.checked); } }
              justify="flex-start" pl="8">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>This number can receive text messages</Checkbox.Label>
            </Checkbox.Root>
          </Flex>
        </section>
  
        <section id="signal">
          <Field.Root  p='8'>
            <Field.Label>
              Signal Handle (if you have that app):
            </Field.Label>
            <Input placeholder="Signal User Name" name="signal" value={data.them.signal}
              onChange={textUpdate} />
          </Field.Root>
        </section>
  
        <section id="email">
          <Field.Root  p='8'>
            <Field.Label>
              Email Address:
            </Field.Label>
            <Input placeholder="me@example.com" name="email" value={data.them.email}
              onChange={textUpdate} />
          </Field.Root>
        </section>
      </>
    );    
  }
}

function Them() {
  const { data, setData } = useDataStore();

  const textUpdate = (evt) => {
    setData({
      ...data,
      them : {
        ...data.them,
        [event.target.name] : evt.target.value,
      },      
    }); 
  };
  
  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      them : {
        ...data.them,
        [field] : value,
      }      
    }); 
  };  

  const next = () => {
    setData({
      ...data,
      page : 'one',
    });
  };  

  const back = () => {
    setData({
      ...data,
      page : 'you',
    });
  };

  useEffect(() => {
    scroll(0,0);
  }, []);

  return (
    <>
      <section id='intro'>
        <p style={{textAlign: 'left', padding: 8}}>
          On this page, please provide information about the person impacted. 
        </p>
      </section>

      <section id="name">
        <Field.Root required p='8'>
          <Field.Label>
            Name <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="Enter their name" value={data.them.name} onChange={textUpdate} name="name" />
        </Field.Root>
      </section>

      <section id="language">
        <Field.Root p='8'>
          <Field.Label>
            Primary Language
          </Field.Label>
          <Input placeholder="Enter the language they are most comfortable speaking and reading" 
            name="primaryLanguage" value={data.them.primaryLanguage} onChange={textUpdate} />
        </Field.Root>
      </section>

      <section id="other-languages">
        <Field.Root  p='8'>
          <Field.Label>
            They also know the following languages:
          </Field.Label>
          <Input placeholder="Other languages they are comfortable speaking and reading"
            name="secondaryLanguages" value={data.them.secondaryLanguages} onChange={textUpdate} />
        </Field.Root>
      </section>

      
      <ContactInfo />

      <section id="share">
        <Field.Root  p='8'>
          <Field.Label>
            Is it OK to share basic impact and contact info for the impacted household
            with government agencies and nonprofits? This is entirely
            optional&mdash;government knowledge of where someone lives may put some people in
            danger, while being able to connect them to other resources and include their
            impacts for assessment of government-declared "states of emergency" may make
            more resources available: 
            <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span>
          </Field.Label>
          <Field.HelperText>
            Information from this form is stored encrypted and is available only to vetted TMA 
            volunteers.
          </Field.HelperText>
        </Field.Root>
        <RadioGroup.Root value={data.them.shareOK} 
          onValueChange={ (state) => radioUpdate('shareOK', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='true' value={true} placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Yes, sharing information for the purpose of aid is OK.</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='false' value={false} placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Please keep household information confidential.</RadioGroup.ItemText>
            </RadioGroup.Item>   
          </Flex>       
        </RadioGroup.Root>
      </section>

      <Grid templateColumns="repeat(2, 1fr)" gap={2} mt="8" mb="100">
        <GridItem>
          <Button colorPalette="grey" variant="solid" onClick={back}>Back</Button>
        </GridItem>
        <GridItem>
          <Button colorPalette="green" variant="solid" onClick={next}
            disabled={("" === data.them.name)}>
            Continue <RiArrowRightLine />
          </Button>
        </GridItem>
      </Grid>
           
      <div style={{height: 150}}>
        &nbsp;
      </div>
 
    </>
  );
}

export default Them;