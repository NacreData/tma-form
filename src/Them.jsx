import { Field, Flex, Button, Input, RadioGroup, Checkbox } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";

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

  const next = () => {
    setData({
      ...data,
      page : 'one',
    });
  };  

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

     
      <Button colorPalette="green" variant="solid" mt="8" mb="100" onClick={next}
        disabled={("" === data.them.name)}>
        Continue <RiArrowRightLine />
      </Button> 
      
      <div style={{height: 150}}>
        &nbsp;
      </div>
 
    </>
  );
}

export default Them;