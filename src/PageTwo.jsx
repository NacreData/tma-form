import { Field, Input, Checkbox, RadioGroup, Flex, Button, Textarea, Alert,
  Grid, GridItem } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { encryptSubmission } from './Asymmetric.js';
import { useEffect } from 'react';

function Insurance() {
  const { data, setData } = useDataStore();

  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        [field] : value,
      },      
    }); 
  };
  
  if ("unhoused" === data.impacted.housingOwnership) {
    return (<></>);
  }
  else if ('rented' === data.impacted.housingOwnership) {  
    return (
      <section id="insurance">
        <Field.Root  p='8'>
          <Field.Label>
            Does the impacted property have renter&rsquo;s insurance? 
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.impacted.rentersInsurance} 
          onValueChange={ (state) => radioUpdate('rentersInsurance', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='yes' value='yes' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Yes &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='no' value='no' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>No</RadioGroup.ItemText>
            </RadioGroup.Item>   
          </Flex>       
        </RadioGroup.Root>
      </section>    
    );
  }
  else {
    return (
      <section id="insurance">
        <Field.Root  p='8'>
          <Field.Label>
            Does the impacted property have home insurance? 
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.impacted.homeInsurance} 
          onValueChange={ (state) => radioUpdate('homeInsurance', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='yes' value='yes' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Yes &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='no' value='no' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>No</RadioGroup.ItemText>
            </RadioGroup.Item>   
          </Flex>       
        </RadioGroup.Root>
      </section>    
    );
  }
}

function Storm() {
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
  
  if ("unhoused" === data.impacted.housingOwnership) {
    return (<></>);
  }
  else if (data.disaster.storm) {
    return (
      <>
        <Field.Root  p='8'>
          <Field.Label>
            What is the nature of the storm damage on your property?
          </Field.Label>
        </Field.Root>
        <Input placeholder="Water coming in? Tree blocking drive? Power out? No access to water? Etc." name="stormDamage" ml='8' w='90%'
            value={data.impacted.stormDamage} onChange={textUpdate} mb='8' />         
      </>
    );
  }
  else { return(<></>); }
}

function Flood() {
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
  
  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        [field] : value,
      },      
    }); 
  };
  
  if (data.disaster.flood && "unhoused" !== data.impacted.housingOwnership) {
    return (
      <>      
        <section id="floodAmount">
          <Field.Root  p='8'>
            <Field.Label>
              How much flooding have you experienced?  
            </Field.Label>
          </Field.Root>
  
          <RadioGroup.Root value={data.impacted.floodAmount} 
            onValueChange={ (state) => radioUpdate('floodAmount', state.value) }>
            
            <Flex gap="4" direction="column" pl="8" mt="-5">
              <RadioGroup.Item key='footOrMore' value='footOrMore' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>One foot or more of water</RadioGroup.ItemText>
              </RadioGroup.Item>
    
              <RadioGroup.Item key='fewInches' value='fewInches' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>A few inches of water on the first floor</RadioGroup.ItemText>
              </RadioGroup.Item>
    
              <RadioGroup.Item key='notMuch' value='notMuch' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Less than a few inches</RadioGroup.ItemText>
              </RadioGroup.Item>
            </Flex>       
          </RadioGroup.Root>
        </section>

        <section id="floodWhere">
          <Field.Root  p='8'>
            <Field.Label>
              Which parts of your home were impacted by flooding?  
            </Field.Label>
          </Field.Root>

          <RadioGroup.Root value={data.impacted.floodWhere} 
            onValueChange={ (state) => radioUpdate('floodWhere', state.value) }>
            
            <Flex gap="4" direction="column" pl="8" mt="-5">
              <RadioGroup.Item key='mainLivingArea' value='mainLivingArea' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Main living area</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item key='basement' value='basement' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Basement</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item key='outdoor' value='outdoor' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Outdoor area</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item key='other' value='other' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Other:</RadioGroup.ItemText>
              </RadioGroup.Item>
              
              { ('other' === data.impacted.floodWhere) && 
              <Input placeholder="(fill in if choosing other)" name="otherFloodingWhere" 
                value={data.impacted.otherFloodingWhere} onChange={textUpdate} w='90%' /> 
              }
            </Flex>       
          </RadioGroup.Root>
        </section>    
      </>
    );        
  }
  else {
    return (<></>);
  }
}

function Snow() {
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
  
  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      impacted : {
        ...data.impacted,
        [field] : value,
      },      
    }); 
  };

  if (data.disaster.snow) {
    return (
        <section id="snowStorm">
          <Field.Root  p='8'>
            <Field.Label>
              Do you need shoveling or de-icing to safely return to your property? 
            </Field.Label>
          </Field.Root>
  
          <RadioGroup.Root value={data.impacted.shoveling} 
            onValueChange={ (state) => radioUpdate('shoveling', state.value) }>
            
            <Flex gap="4" direction="column" pl="8" mt="-5">
              <RadioGroup.Item key='yes' value='yes' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Yes</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item key='no' value='no' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>No</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item key='other' value='other' placement="left">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Other</RadioGroup.ItemText>
              </RadioGroup.Item>

              { ('other' === data.impacted.shoveling) && 
              <Input placeholder="(fill in if choosing other)" name="otherShoveling" 
                value={data.impacted.otherShoveling} onChange={textUpdate} w='90%' /> 
              }
            </Flex>       
          </RadioGroup.Root>
        </section>        
    );
  }
  else {
    return (<></>);
  }
}

function Heat() {
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

  if (data.disaster.heat) {
    return (
      <section id="heat">
        <Field.Root  p='8'>
          <Field.Label>
             Is there anyone in your household with vulnerabilities to heat stroke,
             including medication-induced heat sensitivity (common for psychiatric
             medications)? 
          </Field.Label>
        </Field.Root>
      
        <Flex direction="column"> 
          <Checkbox.Root variant='outline' checked={data.impacted.elders}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("elders", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Elders</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.chronicIllness}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("chronicIllness", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Chronically ill individuals (e.g. POTS)</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.medSenstivity}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("medSenstivity", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Medication-induced sensitivites</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.infant}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("infant", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Infant/s or young children</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.heatOther}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("heatOther", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Other:</Checkbox.Label>
          </Checkbox.Root>

          { data.impacted.heatOther && 
          <Input placeholder="(fill in if choosing other)" name="heatOtherValue" 
            value={data.impacted.heatOtherValue} onChange={textUpdate} ml='8' w='90%' />  
          }          
        </Flex>
      </section>
    );
  }
  else {
    return (<></>);
  }
}

function PageTwo() {
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
      loading : true,
      err     : "",
    });
    
    encryptSubmission(data, setData);
    // submission
  };  
  
  const back = () => {
    setData({
      ...data,
      page : 'one',
    });
  };

  useEffect(() => {
    scroll(0,0);
  }, []);

  return (
    <>      
      <Insurance />

      { (data.disaster.flood && "unhoused" !== data.impacted.housingOwnership) &&
      <section id="flood-insurance">
        <Field.Root  p='8'>
          <Field.Label>
            Does the impacted property have flood insurance? 
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.impacted.floodInsurance} 
          onValueChange={ (state) => radioUpdate('floodInsurance', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='yes' value='yes' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Yes &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='no' value='no' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>No</RadioGroup.ItemText>
            </RadioGroup.Item>   
          </Flex>       
        </RadioGroup.Root>
      </section>    
      }

      <section id="impacted-address">
        <Field.Root  p='8'>
          <Field.Label>
            {
              ("unhoused" == data.impacted.housingOwnership) ?
              <>Approximately where were you staying when the disaster occured?</> :
              <>What is the address of the place impacted by the disaster?</>
            }
          </Field.Label>
          
          <Grid templateRows="repeat(2, 1fr)"
            templateColumns="repeat(5, 1fr)"
            gap={2}>
          
            <GridItem colSpan={5}>
              <Input placeholder="street address" name="placeImpacted" value={data.impacted.placeImpacted} 
              onChange={textUpdate} />
            </GridItem>
            
            <GridItem colSpan={3}>
              <Input placeholder="town or city" name="impactedCity" value={data.impacted.impactedCity} 
              onChange={textUpdate} />
            </GridItem>
            
            <GridItem>
              <Input placeholder="state" name="impactedState" value={data.impacted.impactedState} 
              onChange={textUpdate} />
            </GridItem>
            
            <GridItem>
              <Input placeholder="zip" name="supportZip" 
              value={data.impacted.impactedZip} onChange={textUpdate} />
            </GridItem>
          </Grid>
        </Field.Root>
      </section>

      <section id="support-address">
        <Field.Root  p='8'>
          <Field.Label>
            At what address can supplies/support be received?
          </Field.Label>
          
          <Grid templateRows="repeat(2, 1fr)"
            templateColumns="repeat(5, 1fr)"
            gap={2}>
            
            <GridItem colSpan={5}>
              <Input placeholder="street address" name="placeSupport" 
              value={data.impacted.placeSupport} onChange={textUpdate} />
            </GridItem>
            
            <GridItem colSpan={3}>
              <Input placeholder="city" name="supportCity" 
              value={data.impacted.supportCity} onChange={textUpdate} />
            </GridItem>
            
            <GridItem>
              <Input placeholder="state" name="supportState" 
              value={data.impacted.supportState} onChange={textUpdate} />
            </GridItem>
            
            <GridItem>
              <Input placeholder="zip" name="supportZip" 
              value={data.impacted.supportZip} onChange={textUpdate} />
            </GridItem>           
          </Grid>
        </Field.Root>       
      </section>



      { "unhoused" !== data.impacted.housingOwnership &&
      <section id="housingType">
        <Field.Root  p='8'>
          <Field.Label>
            The impacted property is a&hellip; 
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.impacted.housingType} 
          onValueChange={ (state) => radioUpdate('housingType', state.value) }>
          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='singleFamily' value='singleFamily' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Single Family Home</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='duplex' value='duplex' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Duplex</RadioGroup.ItemText>
            </RadioGroup.Item>   

            <RadioGroup.Item key='apartment' value='apartment' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Apartment</RadioGroup.ItemText>
            </RadioGroup.Item>   

            <RadioGroup.Item key='unhoused' value='unhoused' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>The impacted person is currently unhoused</RadioGroup.ItemText>
            </RadioGroup.Item>   


            <RadioGroup.Item key='other' value='other' placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Other:</RadioGroup.ItemText>
            </RadioGroup.Item>   
            
            { ('other' === data.impacted.housingType) &&
            <Input placeholder="(fill in if choosing other)" name="otherHousingType" 
              value={data.impacted.otherHousingType} onChange={textUpdate} w='90%' />    
            }         
          </Flex>       
        </RadioGroup.Root>
      </section> 
      }   
      
      <section id="needs">
        <Field.Root  p='8'>
          <Field.Label>
            Because of the recent disaster, I need the following supplies: 
          </Field.Label>
        </Field.Root>
        
        <Flex direction="column"> 
          <Checkbox.Root variant='outline' checked={data.impacted.hygiene}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("hygiene", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Personal hygiene items and toiletries</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.food}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("food", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Shelf stable food</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.water}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("water", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Drinking water</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.ppe}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("ppe", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>PPE</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.heavyCleaning}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("heavyCleaning", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Heavy duty cleaning supplies AKA mucking out (such as shop vac, dumpster, push brooms, etc)</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.lightCleaning}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("lightCleaning", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Light cleaning supplies (such as clorox wipes, simple green, paper towels, etc)</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.dehumidifiers}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("dehumidifiers", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Dehumidifiers</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.clothing}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("clothing", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Clothing</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.bedding}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("bedding", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Bedding</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.furniture}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("furniture", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Furniture</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.hasOtherNeed}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("hasOtherNeed", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Other</Checkbox.Label>
          </Checkbox.Root>
          
          { data.impacted.hasOtherNeed &&
          <Input placeholder="(fill in if choosing other)" name="otherNeed" 
            value={data.impacted.otherNeed} onChange={textUpdate} ml='8' w='90%' />      
          }     
        </Flex>        
      </section>
      
      <section id="services">
        <Field.Root  p='8'>
          <Field.Label>
            Because of the recent disaster, I could use the following support: 
          </Field.Label>
        </Field.Root>

        <Flex direction="column"> 
          <Checkbox.Root variant='outline' checked={data.impacted.childcare}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("childcare", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Childcare</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.rides}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("rides", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Assistance with transportation (e.g. rides to work/doctor/etc)</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.housing}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("housing", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Finding temporary housing</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.navigator}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("navigator", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Navigating bureaucratic systems/community services</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.vehicle}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("vehicle", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Vehicle assessment and/or repair</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root variant='outline' checked={data.impacted.needOtherService}  mb='4'
            onCheckedChange={ (state) => { checkboxUpdate("needOtherService", state.checked); } }
            justify="flex-start" pl="8">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Other:</Checkbox.Label>
          </Checkbox.Root>

          { data.impacted.needOtherService &&
          <Input placeholder="(fill in if choosing other)" name="otherService" 
            value={data.impacted.otherService} onChange={textUpdate} ml='8' w='90%' /> 
          }
        </Flex>      
      </section>
      
      <Storm />
      
      <Flood />
      
      <Snow />
      
      <Heat />
      
      <section id="whatElse">
        <Field.Root  p='8'>
          <Field.Label>
            What else would you like us to know? 
          </Field.Label>
        </Field.Root>
      
        <Textarea size="lg" value={data.impacted.whatElse} autoresize w='95%' 
          name="whatElse" onChange={textUpdate}  />
      </section>

      <Grid templateColumns="repeat(2, 1fr)" gap={2} mt="8" mb="100">
        <GridItem>
          <Button colorPalette="grey" variant="solid" onClick={back}>Back</Button>
        </GridItem>
        <GridItem>
          <Button colorPalette="green" variant="solid" onClick={next}
            loading={data.loading} loadingText="Encrypting & Saving...">
            Complete Form, Send Data
          </Button>
        </GridItem>
      </Grid>

      { data.err && 
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              {data.err}
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>      
      }
      
      <div style={{height: 150}}>
        &nbsp;
      </div>

    </>
  )

}

export default PageTwo;