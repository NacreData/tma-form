import { Field, Flex, Button, Input, Text, Alert } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { RiArrowRightLine } from "react-icons/ri";
import { ndhash, wrapString, wrap, passKey, unwrap } from './Asymmetric.js';
import {
  PasswordInput
} from "./components/ui/password-input"

function Login() {
  const { data, setData } = useDataStore();

  const textUpdate = (evt) => {
    setData({
      ...data,
      [event.target.name] : evt.target.value,
    }); 
  };

  const back = () => {
    setData({
      ...data,
      page : 'start',
    });
  };
  
  const next = async () => {
    
    setData({
      ...data,
      err     : "",
      loading : true,
    });
  
    const [s, h]    = await ndhash(data.password, 32, wrapString(data.username + 'VhG6X+fEw5zGGFxW')); 
      
    const response  = await fetch(data.endpoint + 'login', {
                        method : "POST",
                        body   : JSON.stringify({username: data.username, password: wrap(h)})
                      });
                      
    let ret        = await response.json(); 
    
    let [passSalt, pKey] = await passKey(data.password, ret.passSalt);
    
    passSalt = undefined;
    ret.passSalt = undefined;
  
    if ("OK" === ret.status) {
      setData({
        ...data,
        password : "", 
        loading  : true,
        token    : ret.token,
        userID   : ret.userID,
        admin    : ret.admin,
        ePrivKey : ret.ePrivKey,
        pkey     : pKey, 
        err      : "",
        page     : 'dashboard',
        password : "",
        subdata  : [],
      });
    }
    else {
      setData({
        ...data,
        loading  : false,
        password : "",
        err      : ret.message,
        token    : "",        
      });
    }  
    
    ret = undefined;
  };
  
  return (
    <>
      <Input placeholder="Username" name="username" mt='10' justify="flex-start"
        value={data.username} onChange={textUpdate}  />    
  
      <PasswordInput placeholder="Pass Phrase" name="password" mb='10' mt='8' justify="flex-start"
        value={data.password} onChange={textUpdate} />    

      <Button colorPalette="green" variant="solid" onClick={next}
        loading={data.loading} loadingText="Checking Database, logging in...">
        Login <RiArrowRightLine />
      </Button> 
      
      { data.loading && 
        <Alert.Root status="info" title="Notice">
          <Alert.Indicator />
          <Alert.Title>Note: Authentication and Encryption/Decryption functions are 
          purposefully slow to make guessing impractical.</Alert.Title>
        </Alert.Root>      
      }

      { data.err &&
        <Text textStyle="sm" fontWeight="light" style={{color: "#ef4444"}} mt="3">
          {data.err}
        </Text>
      }


      <Button colorPalette="grey" variant="solid" mb="100" mt="10" onClick={back}>Back</Button>      

      <div h="150">
        &nbsp;
      </div>
    </>
  );
}

export default Login; 


