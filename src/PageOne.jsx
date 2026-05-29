import { Field, Input, Checkbox, RadioGroup, VStack, Flex, Button } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";

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

      <section id="impacted-address">
        <Field.Root  p='8'>
          <Field.Label>
            What is the address of the place impacted by the disaster?
          </Field.Label>
          <Input placeholder="place impacted" name="placeImpacted" value={data.impacted.placeImpacted} 
            onChange={textUpdate} />
        </Field.Root>
      </section>

      <section id="support-address">
        <Field.Root  p='8'>
          <Field.Label>
            At what address can supplies/support be received?
          </Field.Label>
          <Input placeholder="place to receive support" name="placeSupport" 
            value={data.impacted.placeSupport} onChange={textUpdate} />
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
          </Flex>       
        </RadioGroup.Root>
      </section>

      <Button colorPalette="green" variant="solid" mt="8" mb="100" onClick={next}
        disabled={("" === data.impacted.housingOwnership)}>
        Continue <RiArrowRightLine />
      </Button> 
      
      <div style={{height: 150}}>
        &nbsp;
      </div>

    </>
  )

}

export default PageOne;