import { Text, Button, Code } from "@chakra-ui/react";
import { useDataStore } from "./DataStoreProvider";
import { useEffect } from "react";

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
    });
  };

  useEffect(() => {
    scroll(0,0);
  }, []);
  
  return (
    <div style={{textAlign: "left"}}>
      <section id="thx">
        <Text textStyle="2xl">
          Thanks! We will get back to you as soon as we are able. If other offers of help
          come up in the meantime, please do not hesitate to make use of them. If your 
          needs or circumstance change, let us know by email:
          &nbsp;<a href="mailto:info@trianglemutualaid.org" style={{color: "teal"}}>info@trianglemutualaid.org</a>
        </Text>
      </section>
            
      <section id="theData">
        
        <Text mt="8">
          If you want to review or contribute to the project, it is on GitHub at:
          &nbsp;<a style={{color:"teal"}} href="https://github.com/NacreData/tma-form">https://github.com/NacreData/tma-form</a>
        </Text>
      
        
        <Button colorPalette="green" variant="solid" mt="8" onClick={next}>
          Start Over
        </Button> 
        
        <div style={{height: 150}}>&nbsp;</div>
        
      </section>
    </div>
  );
}

export default Thx;