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

  const checkboxUpdate = (field, isChecked) => { 
    setData({
      ...data,
      user : {
        ...data.user,
        [field] : isChecked,
      },      
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
            Primary Language <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo" style={{flexFlow: "row wrap"}}>*</span>
          </Field.Label>
        </Field.Root>

        <RadioGroup.Root value={data.them.primaryLanguage} 
          onValueChange={ (lang) => radioUpdate('primaryLanguage', lang.value) }>
          <Flex gap="4" direction="row" pl="8" mt="-5">
            <RadioGroup.Item key='en' value='English' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>English</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='es' value='Spanish' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Spanish</RadioGroup.ItemText>
            </RadioGroup.Item>   

            <RadioGroup.Item key='other' value='Other' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Other</RadioGroup.ItemText>
            </RadioGroup.Item>   
          </Flex>       
        </RadioGroup.Root>
        
        { ("Other" === data.them.primaryLanguage) &&
          <Input placeholder="primary language" value={data.them.otherPrimaryLang} 
            onChange={textUpdate} name="otherPrimaryLang" m="8" />
        }

      </section>

      <section id="other-languages">
        <Field.Root  p='8'>
          <Field.Label>
            They also know the following languages:
          </Field.Label>
        </Field.Root>

        <Flex align="start">
          <Checkbox.Root variant='outline' checked={data.them.secondaryEnglish}  mb='8'
            onCheckedChange={ (lang) => { checkboxUpdate("secondaryEnglish", lang.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>English</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.them.secondarySpanish}  mb='8'
            onCheckedChange={ (lang) => { checkboxUpdate("secondarySpanish", lang.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Spanish</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.them.secondaryOther}  mb='8'
            onCheckedChange={ (lang) => { checkboxUpdate("secondaryOther", lang.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Other</Checkbox.Label>
          </Checkbox.Root>

        </Flex>
        { data.them.secondaryOther && 
        <Input placeholder="Other languages you are comfortable speaking and reading" ml="8" mr="8"
          name="secondaryOtherLang" value={data.them.secondaryOtherLang} onChange={textUpdate} />        
        }
      </section>

      
      <ContactInfo />

      <section id="share">
        <Field.Root  p='8'>
          <Field.Label>
            <strong><span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo" style={{flexFlow: "row wrap"}}>*</span> PRIVACY INFORMATION</strong> 
          </Field.Label>
          <Field.HelperText style={{textAlign: 'left'}}>
            <p>Information sharing is optional. By default, all information is stored on an encrypted platform
            and is only available to vetted Triangle Mutual Aid volunteers.</p>
            <p>Government knowledge of where the impacted people live may 
            sometimes put people in danger. However, if they want to be connected to some nonprofit and government agency
            resources, they may be required to share the information. </p><br />
            <p>Government agencies may wish to use reported information related to property damage and 
            ownership in assessing criteria for government-declared "states of emergency".</p>
          </Field.HelperText>
        </Field.Root>
        <RadioGroup.Root value={data.them.shareOK} 
          onValueChange={ (state) => radioUpdate('shareOK', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='true' value={true} placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Yes, you may share the information with government disaster agencies and nonprofits.</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='false' value={false} placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>No, keep the information confidential.</RadioGroup.ItemText>
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
            disabled={("" === data.them.name || "" === data.them.primaryLanguage || "" === data.them.shareOK)}>
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