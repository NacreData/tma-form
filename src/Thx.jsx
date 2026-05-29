import { Text, Button, Code } from "@chakra-ui/react";
import { useDataStore } from "./DataStoreProvider";

function Thx() {
  const { data, setData } = useDataStore();
  
  const next = () => {
    setData({
      ...data,
      page      : "start",
      err       : false,
      loading   : false,
      
      forWhom   : "",
      agree     : false,
      contact   : "",
      disaster  : {
        flood : true,
        storm : true,
        snow  : true,
        heat  : true,
      },
      user : {
        name               : "",
        primaryLanguage    : "",
        secondaryLanguages : "",
        phone              : "",
        canText            : false,
        signal             : "",
        email              : "",
      },
      impacted : {
        payment            : "",
        placeImpacted      : "",
        housingType        : "",  
        placeSupport       : "",
        rentersInsurance   : "",
        homeInsurance      : "",
        floodInsurance     : "",
        housingOwnership   : "",
        otherHousingType   : "",
        hygiene            : "",
        food               : "",
        water              : "",
        ppe                : "",
        heavyCleaning      : "",
        lightCleaning      : "",
        dehumidifiers      : "",
        clothing           : "",
        bedding            : "",
        furniture          : "",
        otherNeed          : "",
        hasOtherNeed       : "",
        childcare          : "",
        rides              : "",
        housing            : "",
        navigator          : "",
        vehicle            : "",
        needOtherService   : "",
        otherService       : "",
        stormDamage        : "",
        floodAmount        : "",
        floodWhere         : "",
        otherFloodingWhere : "",
        shoveling          : "",
        otherShoveling     : "",
        elders             : "",
        chronicIllness     : "",
        medSenstivity      : "",
        infant             : "",
        heatOther          : "",
        heatOtherValue     : "",
        whatElse           : "",
      },
      encData : "",  
    });
  };
  
  return (
    <div style={{textAlign: 'left'}} mb='100'>
      <section id="thx">
        <Text textStyle="2xl">
          Thanks! We will get back to you as soon as we are able. If other offers of help
          come up in the meantime, please do not hesitate to make use of them. If your 
          needs or circumstance change, feel free to let us know by sending us an email at:
          &nbsp;<a href="mailto:info@trianglemutualaid.org" style={{color: 'teal'}}>info@trianglemutualaid.org</a>
        </Text>
      </section>
      
      <section id="development">
        <Text mt='8'>
          The "backend" is still under development - presumably this will be something like 
          a spreadsheet type view, as with Google Forms, though I am also thinking of adding 
          the ability to track a series of interactions between TMA people and those who 
          submitted the form. Any and all suggestions are more than welcome! DM Devin on 
          Signal (username Mithrandir.66) or send to the email address above. 
        </Text>
      </section>
      
      <section id="theData">
        <Text mt='8'>
          Here is what the data you just entered in the various pages of the form will look 
          like when it is saved in the database -- all information is now end-to-end encrypted!!
        </Text>
        
        <Code colorPalette='green' variant="outline" mt='8' w='100%' 
          style={{maxWidth: '100%', overflow: 'wrap', overflowWrap: 'break-word'}}>
            {data.encData}
        </Code>        
        
        <Button colorPalette="green" variant="solid" mt="8" onClick={next}>
          Start Over
        </Button> 
        
      </section>
    </div>
  );
}

export default Thx;