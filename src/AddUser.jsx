import { Field, Flex, Button, Input, Text, Spinner, Icon, Separator, RadioGroup, Span } from "@chakra-ui/react"
import { useDataStore, empty } from "./DataStoreProvider";
import { ndhash, addUser, wrapString, wrap, passKey, unwrap } from './Asymmetric.js';
import { useEffect } from 'react';

/*
Adding a New user 

Conceptually, we need to unencrypt the "master private key" and then re-encrypt it using a new
key derived from the password of the new user, so that they will be able to access data. 

The heavy lifting is done in the file ./src/Asymmetric.js

I. Un-encrypting the "master private key"

  In memory, the master private key is encrypted with a password-derived key. 
  
  All keys are destroyed from memory as soon as they are no longer needed, so we'll need 
  to collect the password again, derive the key, then use that to un-encrypt the master 
  private key.

  A. Derive a key from the password: 
    1. Retrieve the salt associated with this username from the server: 

    const [s, h]    = await ndhash(data.password, 32, wrapString(data.username + 'VhG6X+fEw5zGGFxW')); 
      
    const response  = await fetch(data.endpoint + 'login', {
                        method : "POST",
                        body   : JSON.stringify({username: data.username, password: wrap(h)})
                      });
                      
    const ret       = await response.json(); 
    
    2. Derive the password-derived key: 
    
    const [passSalt, pKey] = await passKey(data.password, ret.passSalt);
    passSalt = undefined;
    ret.passSalt = undefined;
  

  B. Un-encrypt the master private key  
  
    masterPrivateKey = ret.ePrivKey; // from above
    
    // no need to unwrap and import as passDecryptPrivate() does
    
    const haad            = aad([pubMaster, username, 'key']);
    const subtle          = window.crypto.subtle;
    const wrapedPriv      = await decrypt(ePrivKey, pkey, haad, subtle);
    
II. re-encrypting the "master private key" for the new user 

  A. Derive a key from the password:
    const [newPassSalt, newPassKey] = await passKey(newPassword);
    
    // hold onto newPassSalt, we will need to send that to backend 
    
  B. Encrypt the master private key using this new password-derived key
  
    1. Generate hash of password to use in authenticating associated data
    let newSalt2 = wrapString(newUsername + 'VhG6X+fEw5zGGFxW')
    let [newSalt2, newPassHash] = await ndhash('newPassword', 32);
  
    const myEncMasterPriv = encrypt(wrapedPriv, newPassKey, arrayBufferToString(newPassHash), subtle);
  
  C. Send to the backend:
    √ * newUsername
    √ * newPassSalt
    √ * newPassHash
    √ * myEncMasterPriv
    
  D. Email info to new user. 
  
      
*/

function AddUser() {
  const { data, setData } = useDataStore();
  
  const textUpdate = (evt) => {
    setData({
      ...data,
      [event.target.name] : evt.target.value,
    }); 
  };
  
  const radioUpdate = (field, value) => { 
    setData({
      ...data,
      [field] : value,
    }); 
  };
  
  const logout = () => {
    setData({ ...empty });
  };

  const profile = () => {
    setData({
      ...data,
      page : 'profile',
    });
  };
  
  const submissions = () => {
    setData({
      ...data,
      page : 'dashboard',
    });
  };

  const admin = () => {
    setData({
      ...data,
      page : 'admin',
    });
  };
  
  const save = async () => {
    if (data.newUserName && data.newUserEmail) {
      setData({
        ...data,
        loading : true,
      });

      const added = await addUser(data);

      setData({
        ...data,
        newUserName  : "",
        newUserEmail : "", 
        newUserAdmin : false,
        loading      : false,
        password     : "",
      });
    }
    else {
      alert('missing values');
    }
  };
  
  useEffect(() => {
    setData({
      ...data,
      newUserName  : "",
      newUserEmail : "", 
      newUserAdmin : false,
      loading      : false,
      password     : "",
    });
  }, []);
  
  return (
    <>
      <section id="navigation" >
        <Flex justify="center" gap="6" w="100%" mt='10'>
          <Button colorPalette="red" variant="solid" onClick={logout}>
            Logout
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={profile}>
            Profile
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={submissions}>
            Submissions
          </Button>    
                
          <Button colorPallet="teal" variant="outline" onClick={admin}>
            Admin
          </Button>          
        </Flex>
      </section>
      
      <section id="add-user">
        <Separator mt='8' />
        
        <Text>
        A random password will be generated and emailed, along with a link to the login page,
        to the new user. 
        </Text>
      
        <Field.Root p='8' key="name">
          <Field.Label>
            Username of new user:
          </Field.Label>
          <Input mt="4" placeholder="JohnSmith" value={data.newUserName} onChange={textUpdate} name="newUserName" />          
        </Field.Root>

        <Field.Root p='8' key="email">
          <Field.Label>
            Email of new user:
          </Field.Label>
          <Input mt="4" placeholder="john.smith@gmail.com" value={data.newUserEmail} onChange={textUpdate} name="newUserEmail" />          
        </Field.Root>

        <Field.Root p='8' key="admin">
          <Field.Label>
            Give user Admin privledge? (manage users, edit submissions)
          </Field.Label>
        </Field.Root>
        <RadioGroup.Root value={data.newUserAdmin} 
          onValueChange={ (state) => radioUpdate('newUserAdmin', state.value) }>

          <Flex gap="4" direction="column" pl="8" mt="-5">
            <RadioGroup.Item key='newUserAdminNo' value={false} placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>No &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item key='newUserAdminYes' value={true} placement="left">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Yes &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</RadioGroup.ItemText>
            </RadioGroup.Item>
          </Flex>
        </RadioGroup.Root>    
        
        <Field.Root p='8' key="pass">
          <Field.Label>
            <strong>Your</strong> password:
          </Field.Label>
          <Input mt="4" placeholder="" value={data.password} onChange={textUpdate} name="password" />          
        </Field.Root>        
        
        <Button colorPalette="green" variant="solid" onClick={save} loading={data.loading}>Save</Button>
      </section>
    </>  
  );
}

export default AddUser; 