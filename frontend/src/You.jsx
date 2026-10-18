import { Field, Flex, Button, Input, RadioGroup, Checkbox, Text, Grid, GridItem } from "@chakra-ui/react";
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";
import { useEffect } from 'react';

function Intro() {
  const { data, setData } = useDataStore();

  if ('myself' === data.forWhom) {
    return (
      <p style={{textAlign: 'left', padding: 8}}>
        Ok, first some basic contact info:
      </p>      
    );
  }
  else {
    return (
      <p style={{textAlign: 'left', padding: 8}}>
        Ok, first let us know who you are and how to get in touch with you. Then we will
        ask about the person you are making the request on behalf of. 
      </p>      
    );
  }
}

function Next() {
  const { data, setData } = useDataStore();

  if ('them' === data.forWhom) {
    const radioUpdate = (field, value) => { 
      setData({
        ...data,
        [field] : value,
      }); 
    };

    const next = () => {
      setData({
        ...data,
        page : 'them',
        them : {
          name               : "",
          primaryLanguage    : "",
          otherPrimaryLang   : "",
          secondaryEnglish   : "",
          secondarySpanish   : "",
          secondaryOther     : "",
          secondaryOtherLang : "",
          phone              : "",
          signal             : "",
          email              : "",
          shareOK            : "",
        }
      })
    };  


    const back = () => {
      setData({
        ...data,
        page : 'start',
      });
    };

    return (
      <>
        <section id="contact">
          <Field.Root  p='8'>
            <Field.Label>
              To contact the person for whom you are filling out the form: 
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span>
            </Field.Label>
          </Field.Root>
          <RadioGroup.Root value={data.contact} 
            onValueChange={ (state) => radioUpdate('contact', state.value) }>
            <Flex gap="4" direction="column" pl="8" mt="-5">
              <RadioGroup.Item key='them' value='them' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>I will fill out contact info for them, you should be able to follow up directly with them.</RadioGroup.ItemText>
              </RadioGroup.Item>
  
              <RadioGroup.Item key='me' value='me' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Probably best to contact me and I will relay information as needed.</RadioGroup.ItemText>
              </RadioGroup.Item>   
            </Flex>       
          </RadioGroup.Root>
        </section>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={2} mt="8" mb="100">
          <GridItem>
            <Button colorPalette="grey" variant="solid" onClick={back}>Back</Button>
          </GridItem>
          <GridItem>
            <Button colorPalette="green" variant="solid"  onClick={next}
              disabled={("" === data.contact || "" === data.user.name || "" === data.user.primaryLanguage || ("" === data.user.phone && "" === data.user.signal && "" === data.user.email))}>
              Continue <RiArrowRightLine />
            </Button> 
          </GridItem>
        </Grid>

        { ("" === data.contact || "" === data.user.name  || "" === data.user.primaryLanguage || ("" === data.user.phone && "" === data.user.signal && "" === data.user.email)) &&
          <Text textStyle="sm" fontWeight="light" style={{color: "#ef4444"}} mt="3">
            complete all required fields, marked with a red asterisk, to continue
          </Text>
        }

      </>
    );
  }
  else {
    const next = () => {
      setData({
        ...data,
        page : 'one',
      });
    };  
    
    const back = () => {
      setData({
        ...data,
        page : 'start',
      });
    };

    const shareUpdate = (field, value) => { 
      setData({
        ...data,
        user : {
          ...data.user,
          [field] : value,
        },
      }); 
    };
    
    return (
      <>
        <section id="share">
          <Field.Root  p='8'>
            <Field.Label>
              <strong><span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo" style={{flexFlow: "row wrap"}}>*</span> PRIVACY INFORMATION</strong> 
            </Field.Label>
            <Field.HelperText style={{textAlign: 'left'}}>
              <p>Information sharing is optional. By default, all information is stored on an encrypted platform
              and is only available to vetted Triangle Mutual Aid volunteers.</p>
              <p>Government knowledge of where you live may put 
              some people in danger. However, if you want to be connected to some nonprofit and government agency
              resources, they may require things like your legal name, address, etc.</p><br />
              <p>Government agencies may wish to use reported information related to property damage and 
              ownership in assessing criteria for government-declared "states of emergency".</p>
            </Field.HelperText>
          </Field.Root>
          <RadioGroup.Root value={data.user.shareOK} 
            onValueChange={ (state) => shareUpdate('shareOK', state.value) }>
            <Flex gap="4" direction="column" pl="8" mt="-5">
              <RadioGroup.Item key='true' value={true} placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Yes, you may share my information with government disaster agencies and nonprofits.</RadioGroup.ItemText>
              </RadioGroup.Item>
  
              <RadioGroup.Item key='false' value={false} placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>No, keep my information confidential.</RadioGroup.ItemText>
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
              disabled={("" === data.user.name || "" === data.user.shareOK || "" === data.user.primaryLanguage || ("" === data.user.phone && "" === data.user.signal && "" === data.user.email))}>
              Continue <RiArrowRightLine />
            </Button>
          </GridItem>
        </Grid>

        { ("" === data.user.name || "" === data.user.shareOK || "" === data.user.primaryLanguage || ("" === data.user.phone && "" === data.user.signal && "" === data.user.email)) &&
          <Text textStyle="sm" fontWeight="light" style={{color: "#ef4444"}} mt="3">
            complete all required fields, marked with a red asterisk, to continue
          </Text>
        }

      </>
    );
  }
}

function You() {
  const { data, setData } = useDataStore();

  const textUpdate = (evt) => {
    setData({
      ...data,
      user : {
        ...data.user,
        [event.target.name] : evt.target.value,
      },      
    }); 
  };

  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      [field] : value,
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
  
  useEffect(() => {
    scroll(0,0);
  }, []);
  
  const radioUserUpdate = (e, f) => {
    setData({
      ...data,
      user : {
        ...data.user,
        [e] : f,
      }
    });
  }

  return (
    <>
      <section id='intro'>
        <Intro />
      </section>

      <section id="name">
        <Field.Root required p='8'>
          <Field.Label>
            Your Name <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="Enter your name" value={data.user.name} onChange={textUpdate} name="name" />
        </Field.Root>
      </section>

      <section id="primary-langugae">
        <Field.Root required p='8'>
          <Field.Label>
            Your Primary Language <Field.RequiredIndicator />
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.user.primaryLanguage} 
          onValueChange={ (lang) => radioUserUpdate('primaryLanguage', lang.value) }>
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
        
        { ("Other" === data.user.primaryLanguage) &&
          <Input placeholder="primary language" value={data.user.otherPrimaryLang} 
            onChange={textUpdate} name="otherPrimaryLang" m="8" />
        }
        
      </section>
      
      <section id="other-languages">
        <Field.Root  p='8'>
          <Field.Label>
            I also know the following languages:
          </Field.Label>
        </Field.Root>
          
        <Flex align="start">
          <Checkbox.Root variant='outline' checked={data.user.secondaryEnglish}  mb='8'
            onCheckedChange={ (lang) => { checkboxUpdate("secondaryEnglish", lang.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>English</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.user.secondarySpanish}  mb='8'
            onCheckedChange={ (lang) => { checkboxUpdate("secondarySpanish", lang.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Spanish</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.user.secondaryOther}  mb='8'
            onCheckedChange={ (lang) => { checkboxUpdate("secondaryOther", lang.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Other</Checkbox.Label>
          </Checkbox.Root>

        </Flex>
        { data.user.secondaryOther && 
        <Input placeholder="Other languages you are comfortable speaking and reading" ml="8" mr="8"
          name="secondaryOtherLang" value={data.user.secondaryOtherLang} onChange={textUpdate} />
        
        }
      </section>

      <section id="phone">
        <Field.Root  p='8'>
          <Field.Label>
            Phone Number:
          </Field.Label>
          <Input placeholder="What is your phone number?" name="phone" value={data.user.phone}
            onChange={textUpdate} />
        </Field.Root>
        <Flex direction="column"> 
          <Checkbox.Root variant='outline' checked={data.user.canText}  mb='8'
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
          <Input placeholder="Signal User Name" name="signal" value={data.user.signal}
            onChange={textUpdate} />
        </Field.Root>
      </section>

      <section id="email">
        <Field.Root  p='8'>
          <Field.Label>
            Email Address:
          </Field.Label>
          <Input placeholder="me@example.com" name="email" value={data.user.email}
            onChange={textUpdate} />
        </Field.Root>
      </section>
      
      <section id="someComms">
        <Field.Root required p='8'>
          <Field.Label>
            <Field.RequiredIndicator /> Please provide at least one of Phone, Signal Handle, or Email. 
          </Field.Label>
        </Field.Root>      
      </section>

      <Next />
      
      <div style={{height: 150}}>
        &nbsp;
      </div>
 
    </>
  );
}

export default You;