import { Field, Flex, Button, Input, Text, Table, Stack, Blockquote, Alert, Center } from "@chakra-ui/react"
import { useDataStore, empty } from "./DataStoreProvider";
import { useEffect } from 'react';
import { reKeyPassNewUser, newUserPass } from './Asymmetric.js';
import zxcvbn from 'zxcvbn';

function Profile() {
  const { data, setData } = useDataStore();
  
  const back = () => {
    setData({
      ...data,
      page : 'dashboard',
    });
  };
  
  const update = async () => {
    if (data.newUsername === data.username && "" === data.password && "" === data.newPassword) {
      back();
      return false;
    }
    else if (!data.newUsername) {
      setData({
        ...data,
        error : "Each user must have a unique username",
      });    
      return false;
    }
    else if ("" !== data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        setData({
          ...data,
          error : "New Password & Confirmation Do Not Match",
        });
        return false;
      }
      else if (!data.password) {
        setData({
          ...data,
          error : "Existing Password Needed for Authentication",
        });
        return false;
      }
      
      // https://github.com/dropbox/zxcvbn
      const dontUseWords = [data.newUsername, 'mutual', 'aid', 'disaster', 'tma'];
      
      const evaluatePassword = zxcvbn(data.newPassword, dontUseWords);
      
      if (evaluatePassword.score < 4) {
        const err = ['Password too weak'];
        if (evaluatePassword.feedback && evaluatePassword.feedback.warning) { err.push(evaluatePassword.feedback.warning); }
        if (evaluatePassword.feedback && evaluatePassword.feedback.suggestions) { err.push(evaluatePassword.feedback.suggestions); }

        setData({
          ...data, 
          error : err.join('. ')
        });
        
        return false;
      }
    }
    
    setData({
      ...data,
      loading : true,
      error   : "",
    });

    const resp = await newUserPass(data, data.newPassword);
    
    if (resp[0]) {
      const [success, token, newPassKey, newEncMasterPriv] = [...resp];
      
      setData({ 
        ...empty,
        page     : 'login',        
      });
    }
    else {
      const [success, message, token] = [...resp];
      setData({
        ...data, 
        token    : token, 
        error    : message,
        loading  : false
      });
    }
  };

  const textUpdate = (evt) => {
    setData({
      ...data,
      [event.target.name] : evt.target.value,
      error : "",
    }); 
  };

  useEffect(() => {
    scroll(0,0);
    setData({
      ...data,
      password        : "",
      newPassword     : "", 
      confirmPassword : "",
      newUsername     : data.username,
      error           : "",
    });
  }, []);
  
  const logout = () => {
    setData({ ...empty });
  };
  
  const dashboard = () => {
    setData({
      ...data,
      page : 'dashboard',
    });
  };

  const admin = () => {
    setData({
      ...data,
      page     : 'admin',
      password : "",
    });
  };
  

  return (
    <>
      <section id="navigation" >
        <Flex justify="center" gap="6" w="100%" mt='10'>
          <Button colorPalette="red" variant="solid" onClick={logout}>
            Logout
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={dashboard}>
            Dashboard
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={admin}>
            Admin
          </Button>          
        </Flex>
      </section>

      <div style={{marginTop:15}}>
      <Center><Text textStyle="3xl" fontWeight="bold">Update your Profile</Text></Center>
      </div>
    
      <Field.Root p='8' mt='10'>
        <Field.Label>Username (used for logging in and displayed to other users)</Field.Label>
        <Input placeholder="Username" name="newUsername" mb='5' justify="flex-start"
          value={data.newUsername} onChange={textUpdate} w='90%' /> 
      </Field.Root>
      
      <Field.Root p='8'>
        <Field.Label>Existing Password</Field.Label>
        <Input name="password" mb='10' justify="flex-start"
          value={data.password} onChange={textUpdate} w='90%' /> 
      </Field.Root>
      
      <Stack gap="5" align="flex-start" >
        <Text minW="5ch">Leave Empty unless you want to change your password.</Text>
        <Blockquote.Root colorPalette="red" w='90%'>

          <Field.Root p='4'>
            <Field.Label>New Password</Field.Label>
            <Input name="newPassword" mb='2' justify="flex-start"
              value={data.newPassword} onChange={textUpdate} w='90%' /> 
          </Field.Root>

          <Field.Root p='4'>
            <Field.Label>Confirm New Password</Field.Label>
            <Input name="confirmPassword" mb='2' justify="flex-start"
              value={data.confirmPassword} onChange={textUpdate} w='90%' /> 
          </Field.Root>
        </Blockquote.Root>
      </Stack>

      { data.error && 
        <Alert.Root status="error" mt='5' mb='5'>
          <Alert.Indicator />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>
            {data.error }
          </Alert.Description>
        </Alert.Root>      
      }
      
      <Button colorPalette="green" variant="solid" onClick={update} mt="8" 
      loading={data.loading}>Update</Button>
      
      <Button colorPalette="grey" variant="solid" onClick={back} mt="8">Back</Button>
    </>
  );
}

export default Profile;