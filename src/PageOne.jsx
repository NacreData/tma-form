import { Field, Input, Checkbox, RadioGroup, VStack, Flex, Button, Text,
  Grid, GridItem } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";
import { useEffect } from 'react';

function PageOne() {
  const { data, setData } = useDataStore();
  
  const textUpdate = (evt) => {
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        [event.target.name] : evt.target.value,
      },      
    }); 
  };
  
  const checkboxUpdate = (field, isChecked) => { 
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        [field] : isChecked,
      },      
    }); 
  };
  
  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        [field] : value,
      },      
    }); 
  };

  const next = () => {
    setData({
      ...data,
      page : 'two',
    });
  };  
  
  const back = () => {
    if ('them' === data.forWhom) {
      setData({
        ...data,
        page : 'them',
      });
    }
    else {
      setData({
        ...data,
        page : 'you',
      });
    }
  };
  
  useEffect(() => {
    scroll(0,0);
  }, []);

  return (
    <>      
      <section id="payment">
        <Field.Root  p='8'>
          <Field.Label>
            Username/Handle/Email for Cashapp, Venmo, or Paypal account where funds can be sent:
          </Field.Label>
          <Input placeholder="Payment handle" name="payment" value={data.impacted.payment}
            onChange={textUpdate} />
        </Field.Root>
      </section>

      
      <section id="housing-type">
        <Field.Root  p='8'>
          <Field.Label>
            The impacted propoerty is&hellip;
            <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span>
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.impacted.housingOwnership} 
          onValueChange={ (state) => radioUpdate('housingOwnership', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='rented' value='rented' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Rented &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='owned' value='owned' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Owned by the occupant</RadioGroup.ItemText>
            </RadioGroup.Item>   
            
            <RadioGroup.Item key='unhoused' value='unhoused' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Impacted person/people were unhoused prior to this disaster</RadioGroup.ItemText>
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
            disabled={("" === data.impacted.housingOwnership)}>
            Continue <RiArrowRightLine />
          </Button>
        </GridItem>
      </Grid>

      { ("" === data.impacted.housingOwnership) &&
        <Text textStyle="sm" fontWeight="light" style={{color: "#ef4444"}} mt="3">
          complete all required fields, marked with a red asterisk, to continue
        </Text>
      }
      
      <div style={{height: 150}}>
        &nbsp;
      </div>

    </>
  )

}

export default PageOne;