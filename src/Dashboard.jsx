import { Field, Flex, Button, Input, Text, Spinner, Icon, Separator, Accordion, Span,
  NativeSelect, Table  } from "@chakra-ui/react"
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
  
  const formatPhone = (ph) => {
    ph = String(ph);
    ph = ph.replaceAll(/\D/g, '');
    if (10 === ph.length) {
      return '<a href="tel:+1' + ph + '"' + 'style="color: #008080">(' + ph.substring(0,3) +  ') ' 
             + ph.substring(3, 6) + '&ndash;' + ph.substring(6);
    }
    else if (7 === ph.length) {
      return ph.substring(0,3) + '&ndash;' + ph.substring(3);
    }
    else {
      return ph;
    }
  };
  
  const formatEmail = (e) => {
    return `<a href="mailto:${e}" style="color: #008080">${e}</a>`;
  };
  
  const updateStatus = (e) => {
  
  };
  
  const lang = (whom) => {
    const primary   = whom.otherPrimaryLang ? whom.otherPrimaryLang : whom.primaryLanguage;
    const langList = [primary];
    if (whom.secondaryEnglish) { langList.push('English'); }
    if (whom.secondarySpanish) { langList.push('Spanish'); }
    if (whom.secondaryOther) { langList.push(whom.secondaryOtherLang); }
    return langList.join(", ");
  };
  
  const contactInfo = (whom) => {
    let out = [];
    if (whom.phone) { out.push( formatPhone(whom.phone) ); }
    if (whom.signal) { out.push( 'Signal: ' + who.signal ); }
    if (whom.email) { out.push( formatEmail(whom.email) ); }
    return out.join(", ");
  };
  
  const peopleTown = (item) => {
    let info = '';
    if ("myself" === item.content.forWhom) {
      info = item.content.user.name + ' (' + lang(item.content.user) + ')';
      if (item.content.impacted.impactedCity) { info += ' ' + item.content.impacted.impactedCity }
      info += ' ' + contactInfo(item.content.user);
    }
    else {
      info = item.content.user.name + ' (' + lang(item.content.user) + ') ';      
      if ("them" === item.content.contact) {
        info += 'ON BEHALF OF ' + item.content.them.name + ' (' + lang(item.content.them) + ') ';
        if (item.content.impacted.impactedCity) { info += ' ' + item.content.impacted.impactedCity }
        info += ' ' + contactInfo(item.content.them);
      }
      else {
        info += ' ' + contactInfo(item.content.user);
        if (item.content.impacted.impactedCity) { info += ' -- ' + item.content.impacted.impactedCity }
      }
    }
    
    return info;
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

        <Accordion.Root collapsible variant="subtle">
          {data.subdata.map((item, index) => (
            <Accordion.Item key={index} value={index}>
              <Accordion.ItemTrigger>
                <Span flex="1">{displayTimestamp(item.timestamp)}</Span>
                <Span flex="1">
                  <NativeSelect.Root size="sm" width="240px">
                    <NativeSelect.Field value={item.status} onChange={updateStatus}>
                        <option value="new">New</option>
                        <option value="in process">In Process</option>
                        <option value="need info">Need Info</option>
                        <option value="complete">Complete</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Span>
                <Span flex="1" dangerouslySetInnerHTML={{__html: peopleTown(item)}}></Span>
                
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
          
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Submitted on</Table.ColumnHeader>
                        <Table.ColumnHeader>For Whom?</Table.ColumnHeader>
                        <Table.ColumnHeader>Contact</Table.ColumnHeader>
                        <Table.ColumnHeader>My name</Table.ColumnHeader>
                        <Table.ColumnHeader>My Language</Table.ColumnHeader>
                        <Table.ColumnHeader>My Phone</Table.ColumnHeader>
                        <Table.ColumnHeader>My Signal</Table.ColumnHeader>
                        <Table.ColumnHeader>My Email</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key={item.timestamp}>
                        <Table.Cell>{displayTimestamp(item.timestamp)}</Table.Cell>
                        <Table.Cell>{"them" === item.content.forWhom ? 'somone else' : 'myself'}</Table.Cell>
                        <Table.Cell>{("myself" === item.content.forWhom) ? "me" : item.content.contact}</Table.Cell>
                        <Table.Cell>{item.content.user.name}</Table.Cell>
                        <Table.Cell>{item.content.user.primaryLanguage}</Table.Cell>
                        <Table.Cell dangerouslySetInnerHTML={{__html: formatPhone(item.content.user.phone)}}></Table.Cell>
                        <Table.Cell>{item.content.user.signal}</Table.Cell>
                        <Table.Cell dangerouslySetInnerHTML={{__html: formatEmail(item.content.user.email)}}></Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                
                
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>


      </section>
    </>
  );
  
  
}

/*

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
              <Table.ColumnHeader>My Phone</Table.ColumnHeader>
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
                <Table.Cell dangerouslySetInnerHTML={{__html: formatPhone(item.content.user.phone)}}></Table.Cell>
                <Table.Cell textAlign="end">&nbsp;</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
*/

export default Dashboard;