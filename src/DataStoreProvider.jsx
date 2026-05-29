import { createContext, useState, useContext } from "react";

const DataStore = createContext();
export const useDataStore = () => useContext(DataStore);

export const empty = {
  pubMaster : "eyJjcnYiOiJYMjU1MTkiLCJleHQiOnRydWUsImtleV9vcHMiOltdLCJrdHkiOiJPS1AiLCJ4IjoiNEItTmdUVzY1clNrd3I1MXB0UkZPQnFnbnVjbjNBakFjQUVXbjBLeTdUMCJ9",
  endpoint  : "",
  page      : "start",
  err       : false,
  loading   : false,
  
  forWhom   : "",
  agree     : false,
  contact   : "",
  disaster  : {
    flood : true,
    storm : false,
    snow  : false,
    heat  : false,
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