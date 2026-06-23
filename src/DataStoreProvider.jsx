import { createContext, useState, useContext } from "react";

const DataStore = createContext();
export const useDataStore = () => useContext(DataStore);

export const empty = {
  pubMaster : "eyJjcnYiOiJYMjU1MTkiLCJleHQiOnRydWUsImtleV9vcHMiOltdLCJrdHkiOiJPS1AiLCJ4IjoiNEItTmdUVzY1clNrd3I1MXB0UkZPQnFnbnVjbjNBakFjQUVXbjBLeTdUMCJ9",
  endpoint  : "https://e56krwmvma.execute-api.us-east-1.amazonaws.com/0/",
  page      : "start",
  err       : false,
  loading   : false,
  
  username  : "",
  password  : "",
  token     : "",
  
  forWhom   : "",
  agree     : false,
  contact   : "",
  disaster  : {
    flood : true,
    storm : false,
    snow  : false,
    heat  : false,
  },
  user      : {
    name               : "",
    primaryLanguage    : "",
    otherPrimaryLang   : "",
    secondaryEnglish   : "",
    secondarySpanish   : "",
    secondaryOther     : "",
    secondaryOtherLang : "",
    phone              : "",
    canText            : false,
    signal             : "",
    email              : "",
    shareOK            : "",
  },
  impacted  : {
    payment            : "",
    placeImpacted      : "",
    impactedCity       : "",
    impactedState      : "",
    impactedZip        : "",
    housingType        : "",  
    placeSupport       : "",
    supportCity        : "",
    supportState       : "",
    supportZip         : "",
    supportPerson      : "",
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
  }
};

export default function DataStoreProvider({children}) {  
  const [data, setData] = useState(empty);
  
  return (
    <DataStore.Provider value={{ data, setData }}>
      {children}
    </DataStore.Provider>
  );
}