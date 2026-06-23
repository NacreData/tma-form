import { Field, Flex, Button, Input, Text, Spinner, Table, Icon, Separator } from "@chakra-ui/react"
import { useDataStore, empty } from "./DataStoreProvider";
import { useEffect } from 'react';
import { decryptSubmission } from './Asymmetric.js';
import { MdAdsClick } from "react-icons/md"

function Dashboard() {
  const { data, setData } = useDataStore();
  
  const init = async (last_ts, subdata) => {
    const response  = await fetch(data.endpoint + 'list', {
                        method : "POST",
                        body   : JSON.stringify({
                          username : data.username, 
                          token    : data.token,
                          salt     : data.salt,
                          last_ts  : last_ts
                        })
                      });
                      
    const ret       = await response.json(); 
    
    if ('no further data' === ret.message) {
      setData({
        ...data,
        subdata  : subdata,
        loading  : false,
        ePrivKey : undefined,
        pkey     : undefined,
      });
    }
    else {
      const submission = await decryptSubmission(
        data.ePrivKey, 
        data.pkey, 
        data.pubMaster, 
        data.endpoint, 
        data.username,
        ret.content
      );
      
      subdata.push({
        'timestamp' : ret.timestamp,
        'status'    : ret.status,
        'content'   : submission,
      })
      
      setData({
        ...data, 
        subdata : subdata,
      });
    
      init(ret.timestamp, subdata);
    }
  };
  
  useEffect(() => {
    init("0", []);
  }, []);

  const displayTimestamp = (ts) => {
    const tsint = parseInt(ts);
    const d     = new Date(tsint);
    return d.toString().replace(/\:\d\d GMT.*/, '');
  };
  
  const displayLanguages = (whom) => {
    const langSet = [whom.primaryLanguage];
  };
  
  const caseDetail = () => {
    setData({
      ...data,
      page : 'case',
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
  
  const admin = () => {
    setData({
      ...data,
      page : 'admin',
    });
  };
  
  
  return (
    <>
      { data.loading ?
        <section id="loading">
          <Text textStyle="xl" mt='20' mb='20'>Downloading & Decrypting Data</Text>
          <Spinner size="xl"  borderWidth="4px" />
        </section> : 

        <section id="navigation" >
          <Flex justify="center" gap="6" w="100%" mt='10'>
            <Button colorPalette="red" variant="solid" onClick={logout}>
              Logout
            </Button>
            
            <Button colorPallet="teal" variant="outline" onClick={profile}>
              Profile
            </Button>
            
            <Button colorPallet="teal" variant="outline" onClick={admin}>
              Admin
            </Button>          
          </Flex>
        </section>
      }
      
      
      <section id="data-overview">
        <Separator mt='8' />
        <Table.Root size="sm" mt='5'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Details</Table.ColumnHeader>
              <Table.ColumnHeader>Submitted on</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>For Whom?</Table.ColumnHeader>
              <Table.ColumnHeader>Contact</Table.ColumnHeader>
              <Table.ColumnHeader>My name</Table.ColumnHeader>
              <Table.ColumnHeader>Language</Table.ColumnHeader>
              <Table.ColumnHeader>[More columns, some info conditional or condensed...]</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.subdata.map((item) => (
              <Table.Row key={item.timestamp}>
                <Table.Cell>
                  <Button colorPalette="teal" variant="solid" onClick={caseDetail}>
                    <MdAdsClick />
                  </Button>                                
                </Table.Cell>
                <Table.Cell>{displayTimestamp(item.timestamp)}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>{item.content.forWhom}</Table.Cell>
                <Table.Cell>{("myself" === item.content.forWhom) ? "me" : item.content.contact}</Table.Cell>
                <Table.Cell>{item.content.user.name}</Table.Cell>
                <Table.Cell>{item.content.user.primaryLanguage}</Table.Cell>
                <Table.Cell textAlign="end">&nbsp;</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </section>
    </>
  );
  
  
}

export default Dashboard;