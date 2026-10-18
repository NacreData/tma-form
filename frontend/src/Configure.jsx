import { Field, Flex, Button, Input, Text, Spinner, Checkbox, Alert, Box, Center } from "@chakra-ui/react"
import { useDataStore } from "./DataStoreProvider";

function Configure() {
  const { data, setData } = useDataStore();

  const checkboxUpdate = (field, isChecked) => { 
    setData({
      ...data,
      disaster : {
        ...data.disaster,
        [field] : isChecked,
      },      
    });     
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
  
  const admin = () => {
    setData({
      ...data,
      page : 'admin',
    });
  };
  
  const save = async () => {
    setData({
      ...data,
      loading : true,
    });
    
    const response = await fetch(data.endpoint + 'configure', {
                        method : "POST",
                        body   : JSON.stringify({
                          username : data.username, 
                          token    : data.token,
                          flood    : data.disaster.flood,
                          storm    : data.disaster.storm,
                          snow     : data.disaster.snow,
                          heat     : data.disaster.heat,
                          fire     : data.disaster.fire,
                        })
                      });
                      
    const ret = await response.json();
    
    if ('OK' === ret.status) {
      setData({
        ...data, 
        page    : 'admin', 
        loading : false,
      });
    }        
    else {
      setData({
        ...data,
        loading : false,
        error   : ret.message,
      });
    }
  };


  return (
    <Center>

    <Box w="60%" textAlign="left">
      <section id="navigation">
        <Flex justify="center" gap="6" w="100%" mt='10' mb='15'>
          <Button colorPalette="red" variant="solid" onClick={logout}>
            Logout
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={dashboard}>
            Dashboard
          </Button>
          
          <Button colorPallet="teal" variant="outline" onClick={profile}>
            Profile
          </Button>          

          <Button colorPallet="teal" variant="outline" onClick={admin}>
            Existing Users
          </Button>          
          
          <Button colorPalette="teal" variant="outline" onClick={add}>
            Add User
          </Button>          
        </Flex>
      </section>
      
      <section id="configure">
        <Text textStyle="md" mb='8'>    
          Use the checkboxes to describe the sort of disaster taking place, which impacts 
          the type of questions which get asked, as outlined below. 
        </Text>
      
        <Checkbox.Root variant='outline' checked={data.disaster.flood} mb='4'
          onCheckedChange={ (state) => { checkboxUpdate("flood", state.checked); } }
          justify="flex-start" pl="8">
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Flood</Checkbox.Label>
        </Checkbox.Root>
  
        <Checkbox.Root variant='outline' checked={data.disaster.storm} mb='4'
          onCheckedChange={ (state) => { checkboxUpdate("storm", state.checked); } }
          justify="flex-start" pl="8">
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Storm</Checkbox.Label>
        </Checkbox.Root>
  
        <Checkbox.Root variant='outline' checked={data.disaster.snow} mb='4'
          onCheckedChange={ (state) => { checkboxUpdate("snow", state.checked); } }
          justify="flex-start" pl="8">
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Snow</Checkbox.Label>
        </Checkbox.Root>
  
        <Checkbox.Root variant='outline' checked={data.disaster.heat} mb='4'
          onCheckedChange={ (state) => { checkboxUpdate("heat", state.checked); } }
          justify="flex-start" pl="8">
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Heat</Checkbox.Label>
        </Checkbox.Root>
  
        <Checkbox.Root variant='outline' checked={data.disaster.fire} mb='10'
          onCheckedChange={ (state) => { checkboxUpdate("fire", state.checked); } }
          justify="flex-start" pl="8">
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Fire</Checkbox.Label>
        </Checkbox.Root>   
        
        <Box textAlign="center">
        <Button colorPalette="green" variant="outline" onClick={save} loading={data.loading}>Save Updates</Button>

        { data.error && 
          <Alert.Root status="error" mt='5' mb='5'>
            <Alert.Indicator />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              {data.error}
            </Alert.Description>
          </Alert.Root>      
        }
        </Box>
        
        <Text textStyle="2xl" fontWeight="bold" mb='4'>
          Flood
        </Text> 
        
        <Text textStyle="md" mb='8'>
          <Box as="ul" listStyleType="circle">
            <li>Flood insurance?</li>
            <li>How much flooding have you experienced?</li>
            <li>Which parts of your home were impacted by flooding?</li>          
          </Box>
        </Text>       
        
        <Text textStyle="2xl" fontWeight="bold" mb='4'>
          Storm
        </Text> 
        
        <Text textStyle="md" mb='8'>
          <Box as="ul" listStyleType="circle">
            <li>What is the nature of the storm damage on your property?</li>          
          </Box>
        </Text>       
  
        <Text textStyle="2xl" fontWeight="bold" mb='4'>
          Snow
        </Text> 
        <Text textStyle="md" mb='8'>
          <Box as="ul" listStyleType="circle">
            <li>Do you need shoveling or de-icing to safely return to your property?</li>          
          </Box>
        </Text>     
        
        <Text textStyle="2xl" fontWeight="bold" mb='4'>
          Heat
        </Text> 
        <Text textStyle="md" mb='8'>
          <Box as="ul" listStyleType="circle">
            <li>Is there anyone in your household with vulnerabilities to heat stroke,
               including medication-induced heat sensitivity (common for psychiatric
               medications)? </li>          
          </Box>
        </Text>     
        
      </section>
    </Box>
    </Center>
  );
}

export default Configure;