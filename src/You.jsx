import { Field, Flex, Button, Input, RadioGroup, Checkbox } from "@chakra-ui/react";
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";

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
          secondaryLanguages : "",
          phone              : "",
          signal             : "",
          email              : "",
        }
      })
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
       
        <Button colorPalette="green" variant="solid" mt="8" mb="100" onClick={next}
          disabled={("" === data.contact || "" === data.user.name)}>
          Continue <RiArrowRightLine />
        </Button> 
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
    
    return (
      <Button colorPalette="green" variant="solid" mt="8" mb="100" onClick={next}
        disabled={("" === data.user.name)}>
        Continue <RiArrowRightLine />
      </Button> 
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

      <section id="language">
        <Field.Root p='8'>
          <Field.Label>
            Your Primary Language
          </Field.Label>
          <Input placeholder="Enter the language you are most comfortable speaking and reading" 
            name="primaryLanguage" value={data.user.primaryLanguage} onChange={textUpdate} />
        </Field.Root>
      </section>

      <section id="other-languages">
        <Field.Root  p='8'>
          <Field.Label>
            I also know the following languages:
          </Field.Label>
          <Input placeholder="Other languages you are comfortable speaking and reading"
            name="secondaryLanguages" value={data.user.secondaryLanguages} onChange={textUpdate} />
        </Field.Root>
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

      <Next />
      
      <div style={{height: 150}}>
        &nbsp;
      </div>
 
    </>
  );
}

export default You;