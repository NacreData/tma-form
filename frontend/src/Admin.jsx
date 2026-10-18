import { Field, Flex, Button, Input, Text, Spinner, Table, RadioGroup, Alert } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";
import { useEffect } from 'react';

function Admin() {
  const { data, setData } = useDataStore();
  
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!data.users) {
      const response = await fetch(data.endpoint + 'user-list', {
                          method : "POST",
                          body   : JSON.stringify({
                            username   : data.username, 
                            token      : data.token,
                          })
                        });
                        
      const ret = await response.json();
      
      if ('OK' === ret.status) {
        setData({
          ...data, 
          users : ret.users, 
        });
      }        
    }
  };

  const radioUpdate = async (field, value) => { 
    setData({
      ...data,
      loading : true,
      error   : false,
    });
  
    const response = await fetch(data.endpoint + 'update-privilege', {
                        method : "POST",
                        body   : JSON.stringify({
                          username   : data.username, 
                          token      : data.token,
                          user_id    : field,
                          admin      : value
                        })
                      });

    const ret = await response.json();
    
    if ('OK' === ret.status) {    
      const updatedUsers = data.users.reduce((acc, cur) => {
        if (String(cur.id) === String(field)) {
          acc.push({
            ...cur,
            admin : value
          });
        }
        else { acc.push(cur); }
        
        return acc;
      }, []);
      
      setData({
        ...data,
        users   : updatedUsers,
        loading : false,
      });
    }
    else {
      setData({
        ...data,
        error   : 'Login expired',
        loading : false,
      });
    }
  };
    
  const logout = () => {
    setData({ ...empty });
  };
  
  const dashboard = () => {
    setData({
      ...data,
      page : 'dashboard',
    });
  };

  const profile = () => {
    setData({
      ...data,
      page : 'profile',
    });
  };

  const add = () => {
    setData({
      ...data,
      page : 'add',
    });
  };
  
  const configure = () => {
    setData({
      ...data,
      page : 'configure',
    });
  };
  
  const toggleActive = async (e) => {
  
    setData({
      ...data,
      loading : true,
    });
    
    let user = null;
  
    const updatedUsers = data.users.reduce((a, u) => {
      if (String(u.id) === String(e.target.name)) {
        a.push({
          ...u,
          active : !u.active
        });                
      }
      else {
        a.push(u);
      }
      
      user = u;
      
      return a;
    }, []);
  
    const response = await fetch(data.endpoint + 'update-activity', {
                        method : "POST",
                        body   : JSON.stringify({
                          username : data.username, 
                          token    : data.token,
                          user_id  : user.id, 
                          active   : !user.active 
                        })
                      });

    const ret = await response.json();
    
    if ('OK' === ret.status) {    
      setData({
        ...data,
        users   : updatedUsers,
        loading : false,
      });
    }
    else {
      setData({
        ...data,
        error   : 'Login expired',
        loading : false,
      });
    }
  };

  return (
    <>
      <section id="navigation" mb="20">
        <Flex justify="center" gap="6" w="100%" mt='10'>
          <Button colorPalette="red" variant="solid" onClick={logout}>
            Logout
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={dashboard}>
            Dashboard
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={profile}>
            Profile
          </Button>          

          <Button colorPallet="teal" variant="outline" onClick={configure}>
            Configure
          </Button>          
          
          <Button colorPalette="teal" variant="outline" onClick={add}>
            Add User
          </Button>
          
        </Flex>
      </section>

      { data.error && 
        <Alert.Root status="error" mt='5' mb='5'>
          <Alert.Indicator />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>
            {data.error}
          </Alert.Description>
        </Alert.Root>      
      }
      
      { data.loading &&
        <section id="loading">
          <Text textStyle="xl" mt='20' mb='20'>Saving Update</Text>
          <Spinner size="md"  borderWidth="4px" />
        </section>                     
      }

      { data.users.length ? 
        <section id="users" mt="10">
          <Table.Root>
            <Table.Header>
              <Table.Row key='header'>
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>Admin Status</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>   
            <Table.Body>       
            { data.users.map((user, index) => (
            
                <Table.Row key={user.id}>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>
                    <RadioGroup.Root value={user.admin} 
                      onValueChange={ (state) => radioUpdate(user.id, state.value) }>
                  
                      <RadioGroup.Item key='yes' value={true} placement="left">
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>Yes, Admin</RadioGroup.ItemText>
                      </RadioGroup.Item>

                      <RadioGroup.Item key='no' value={false} placement="left" ml="8">
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>No, Not Admin</RadioGroup.ItemText>
                      </RadioGroup.Item>                      
                  
                    </RadioGroup.Root>
                  </Table.Cell>
                  <Table.Cell>
                    { user.active ? 
                      <Button colorPalette="red" variant="solid" onClick={toggleActive} name={user.id}>
                        Deactivate User
                      </Button>  
                      :
                      <Button colorPalette="green" variant="outline" onClick={toggleActive} name={user.id}>
                        Activate User
                      </Button>                                          
                    }
                  </Table.Cell>
                </Table.Row>
            
            ))}
            </Table.Body>
          </Table.Root>
        </section>      
        : 
        <section id="loading">
          <Text textStyle="xl" mt='20' mb='20'>Downloading & Decrypting Data</Text>
          <Spinner size="xl"  borderWidth="4px" />
        </section>               
      }
    </>
  );
}

export default Admin;