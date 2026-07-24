import { Field, Input, Checkbox, RadioGroup, VStack, Flex, Button, Text,
  Grid, GridItem } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine, RiCloseLargeFill } from "react-icons/ri";
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

  // data.impacted.payment []
  
  const cashApp = () => {
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : [
          ...data.impacted.payment,
          'cashApp',
        ]
      }
    }); 
  };  
  
  const notCashApp = () => {
    const pay = data.impacted.payment.reduce((r, p) => {
      if ('cashApp' !== p) { 
        r.push(p);
      }
      return r;
    }, []);
    
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : pay,
      }
    }); 
  };
  
  const notVenmo = () => {
    const pay = data.impacted.payment.reduce((r, p) => {
      if ('venmo' !== p) { 
        r.push(p);
      }
      return r;
    }, []);
    
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : pay,
      }
    }); 
  };
  
  const notPaypal = () => {
    const pay = data.impacted.payment.reduce((r, p) => {
      if ('paypal' !== p) { 
        r.push(p);
      }
      return r;
    }, []);
    
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : pay,
      }
    }); 
  };
  
  const notBank = () => {
    const pay = data.impacted.payment.reduce((r, p) => {
      if ('bank' !== p) { 
        r.push(p);
      }
      return r;
    }, []);
    
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : pay,
      }
    }); 
  };

  const venmo = () => {
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : [
          ...data.impacted.payment,
          'venmo',
        ]
      }
    }); 
  };  

  const paypal = () => {
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : [
          ...data.impacted.payment,
          'paypal',
        ]
      }
    }); 
  };  

  const bank = () => {
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        payment : [
          ...data.impacted.payment,
          'bank',
        ]
      }
    }); 
  };  

  return (
    <>      
      <section id="payment">
        <Field.Root  p='8'>
          <Field.Label>
            How can you recieve financial support?
          </Field.Label>
          <Field.HelperText style={{textAlign: 'left'}}>
            Financial help is not guaranteed. If Triangle Mutual Aid receives donations, we 
            hope to be able to distribute some of those funds directly to impacted people. 
            Funds are also used to purchase needed relief supplies. 
          </Field.HelperText>

          <Flex>
            <Checkbox.Root variant='outline' checked={data.impacted.needFinancial}
              onCheckedChange={ (state) => { checkboxUpdate("needFinancial", state.checked); } }
              justify="flex-start" pl="8" mt='4'>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                Yes, I need financial assistance if it is available.
              </Checkbox.Label>
            </Checkbox.Root>
          </Flex>

          { data.impacted.needFinancial && 
          <Flex gap="8" mt="4">
            { data.impacted.payment.includes('cashApp') ?
              <Button colorPalette="grey" variant="outline" onClick={notCashApp}>
                <span style={{color: 'red'}}><RiCloseLargeFill /></span>
                Cash App
              </Button>
              : <Button colorPalette="grey" variant="solid" onClick={cashApp}>Cash App</Button>
            }
            { data.impacted.payment.includes('venmo') ?
              <Button colorPalette="grey" variant="outline" onClick={notVenmo}>
                <span style={{color: 'red'}}><RiCloseLargeFill /></span>
                Venmo
              </Button>
              : <Button colorPalette="grey" variant="solid" onClick={venmo}>Venmo</Button>
            }
            { data.impacted.payment.includes('paypal') ?
              <Button colorPalette="grey" variant="outline" onClick={notPaypal}>
                <span style={{color: 'red'}}><RiCloseLargeFill /></span>
                PayPal
              </Button>
              : <Button colorPalette="grey" variant="solid" onClick={paypal}>PayPal</Button>
            }
            { data.impacted.payment.includes('bank') ?
              <Button colorPalette="grey" variant="outline" onClick={notBank}>
                <span style={{color: 'red'}}><RiCloseLargeFill /></span>
                Bank Transfer
              </Button>
              : <Button colorPalette="grey" variant="solid" onClick={bank}>Bank Transfer</Button>
            }
          </Flex>  
          }        
        </Field.Root>
      </section>
      
      { (data.impacted.payment.includes('cashApp') && data.impacted.needFinancial) &&
        <section id="cashApp">
          <Field.Root mt="8">
            <Field.Label>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              Cash App Payment Handle:
            </Field.Label>
            <Input mt="4" placeholder="$MyHandle" value={data.impacted.cashAppHandle} onChange={textUpdate} name="cashAppHandle" />
          </Field.Root>
          <Field.Root mt="4">
            <Field.Label>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              Last Four Digits of phone associated with Cash App
            </Field.Label>
            <Input mt="4" placeholder="1234" value={data.impacted.cashAppLast4} onChange={textUpdate} name="cashAppLast4" />          
          </Field.Root>
        </section>      
      }

      { (data.impacted.payment.includes('venmo') && data.impacted.needFinancial) &&
        <section id="venmo">
          <Field.Root mt="8">
            <Field.Label>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              Venmo Payment Handle:
            </Field.Label>
            <Input mt="4" placeholder="@MyHandle" value={data.impacted.venmoHandle} onChange={textUpdate} name="venmoHandle" />
          </Field.Root>
          <Field.Root mt="4">
            <Field.Label>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              Last Four Digits of phone associated with Venmo
            </Field.Label>
            <Input mt="4" placeholder="1234" value={data.impacted.venmoLast4} onChange={textUpdate} name="venmoLast4" />          
          </Field.Root>
        </section>      
      }

      { (data.impacted.payment.includes('paypal') && data.impacted.needFinancial) &&
        <section id="paypal">
          <Field.Root mt="8">
            <Field.Label>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              PayPal Payment Handle or Email address:
            </Field.Label>
            <Input mt="4" placeholder="me@example.com" value={data.impacted.paypalHandle} onChange={textUpdate} name="paypalHandle" />
          </Field.Root>
        </section>      
      }
      
      { (data.impacted.payment.includes('bank') && data.impacted.needFinancial) &&
        <section id="bank">
          <Field.Root mt="8">
            <Field.Label>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              First Name associated with Bank Account
            </Field.Label>
            <Input mt="4" placeholder="First" value={data.impacted.bankFirst} onChange={textUpdate} name="bankFirst" />
          </Field.Root>
          <Field.Root mt="4">
            <Field.Label>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              Last Name associated with Bank Account
            </Field.Label>
            <Input mt="4" placeholder="Last" value={data.impacted.bankLast} onChange={textUpdate} name="bankLast" />
          </Field.Root>
          <Field.Root mt="4">
            <Field.Label>Mobile Phone to send confirmation code</Field.Label>
            <Input mt="4" placeholder="(555) 555-5555" value={data.impacted.bankMobile} onChange={textUpdate} name="bankMobile" />
          </Field.Root>
          <Field.Root mt="4">
            <Field.Label>Email to send confirmation code</Field.Label>
            <Input mt="4" placeholder="me@example.com" value={data.impacted.bankEmail} onChange={textUpdate} name="bankEmail" />
            <Field.HelperText style={{textAlign: 'left'}}>
              <span aria-hidden="true" className="chakra-field__requiredIndicator css-gp8wgo">*</span> 
              One of mobile number or email is required
            </Field.HelperText>
          </Field.Root>
        </section>
      }

      <section id="housing-type">
        <Field.Root p='8'>
          <Field.Label>
            The impacted property is&hellip;
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
            disabled={(
              "" === data.impacted.housingOwnership || 
              (data.impacted.payment.includes('cashApp') && "" === data.impacted.cashAppHandle) ||
              (data.impacted.payment.includes('cashApp') && "" === data.impacted.cashAppLast4) ||
              (data.impacted.payment.includes('venmo') && "" === data.impacted.venmoHandle) ||
              (data.impacted.payment.includes('venmo') && "" === data.impacted.venmoLast4) ||
              (data.impacted.payment.includes('paypal') && "" === data.impacted.paypalHandle) ||
              (data.impacted.payment.includes('bank') && "" === data.impacted.bankFirst) ||
              (data.impacted.payment.includes('bank') && "" === data.impacted.bankLast) ||
              (data.impacted.payment.includes('bank') && ("" === data.impacted.bankMobile || "" === data.impacted.bankEmail)) 
            )}>
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