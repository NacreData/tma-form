import { Field, Flex, Button, Input, Text, Spinner, Icon, Separator, Accordion, Span,
  NativeSelect, Table, Badge, Textarea  } from "@chakra-ui/react"
import { useDataStore, empty } from "./DataStoreProvider";
import { useEffect } from 'react';
import { decryptSubmission, postNote, decryptNote } from './Asymmetric.js';
import { MdAdsClick } from "react-icons/md"

function Dashboard() {
  const { data, setData } = useDataStore();
  
  const get_notes = async (last_ts, submission, subdata, subkeys) => {
    const response = await fetch(data.endpoint + 'notes-list', {
                        method : "POST",
                        body   : JSON.stringify({
                          username   : data.username, 
                          token      : data.token,
                          salt       : data.salt,
                          last_ts    : last_ts,
                          submission : submission.toString()
                        })
                      });
                      
    const ret = await response.json();
    
    if ('no further data' === ret.message) {
      const s    = parseInt(submission);
      const next = subkeys.reduce((a, c) => {
        if (!a && c > s) {
          return c;
        }
        else {
          return a; 
        }
      }, 0);
      
      if (next) {
        get_notes(0, next, subdata, subkeys);
      }
      else {
        setData({
          ...data,
          subdata  : subdata,
          subkeys  : subkeys,
          loading  : false,
          ePrivKey : undefined,
          pkey     : undefined,
        });      
      }
    }
    else {
      const note = await decryptNote(
        data.ePrivKey, 
        data.pkey, 
        data.pubMaster, 
        data.username,
        ret.content
      );
            
      subdata[submission]['notes'][ret.timestamp] = {
        'timestamp' : ret.timestamp, 
        'content'   : note.note, 
        'user'      : note.user
      };
      
      setData({
        ...data, 
        subdata : subdata,
        subkeys : subkeys,
      });
      
      get_notes(ret.timestamp, submission, subdata, subkeys);
    }
  };
  
  const init = async (last_ts, subdata, subkeys) => {
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
      get_notes(0, subkeys[0], subdata, subkeys);
    }
    else {
      const submission = await decryptSubmission(
        data.ePrivKey, 
        data.pkey, 
        data.pubMaster, 
        data.username,
        ret.content
      );
      
      subdata[ret.timestamp] = {
        'timestamp' : ret.timestamp,
        'status'    : ret.status,
        'content'   : submission,
        'notes'     : {},
        'newNote'   : "",
      };
      
      subkeys.push(parseInt(ret.timestamp));
            
      setData({
        ...data, 
        subdata : subdata,
        subkeys : subkeys,
      });
    
      init(ret.timestamp, subdata, subkeys);
    }
  };
  
  useEffect(() => {
    init("0", {}, []);
  }, []);

  const displayTimestamp = (ts) => {
    const tsint = parseInt(ts/1000);
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
  
  const formatPhone = (whom) => {
    let ph = String(whom.phone);
    ph = ph.replaceAll(/\D/g, '');
    if (10 === ph.length) {
      return '<a href="tel:+1' + ph + '"' + 'style="color: #008080">(' + ph.substring(0,3) +  ') ' 
             + ph.substring(3, 6) + '&ndash;' + ph.substring(6);
    }
    else if (7 === ph.length) {
      ph = ph.substring(0,3) + '&ndash;' + ph.substring(3);
    }

    if (whom.canText) { ph += ' (txt)'; }
    
    return ph;
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
    if (whom.phone) { out.push( formatPhone(whom) ); }
    if (whom.signal) { out.push( 'Signal: ' + whom.signal ); }
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
  
  const formatShare = (whom) => {
    if (whom.shareOK) {
      return (<Badge colorPalette="green">Yes</Badge>);
    }
    else {
      return (<Badge colorPalette="red">No</Badge>);
    }
  };
  
  const supportLocation = (impacted) => {
    if (impacted.supportAddressSame) {
      return "same as above";
    }
    else if (impacted.noSupportAddress) {
      return "currently no stable address";
    }
    else {
      return impacted.placeSupport;
    }
  };
  
  const supplies = (impacted) => {
    const s = [];
    if (impacted.hygiene) {
      s.push("personal hygene & toiletries");
    }
    if (impacted.food) {
      s.push("shelf stable food");
    }
    if (impacted.water) {
      s.push("drinking water");      
    }
    if (impacted.ppe) {
      s.push("PPE");
    }
    if (impacted.heavyCleaning) {
      s.push("heavy duty cleaning supplies");
    }
    if (impacted.lightCleaning) {
      s.push("light cleaning supplies");
    }
    if (impacted.dehumidifiers) {
      s.push("dehumidifiers");
    }
    if (impacted.clothing) {
      s.push("clothing");
    }
    if (impacted.bedding) {
      s.push("bedding");
    }
    if (impacted.furniture) {
      s.push("furniture");
    }
    if (impacted.otherNeed) {
      s.push(impacted.otherNeed);
    }
    
    return s.join(", ");
  };
  
  const support = (impacted) => {
    const s = [];
    if (impacted.childcare) {
      s.push("childcare");
    }
    if (impacted.rides) {
      s.push("transportation");
    }
    if (impacted.housing) {
      s.push("temp housing");
    }
    if (impacted.navigator) {
      s.push("help navigating systems");
    }
    if (impacted.vehicle) {
      s.push("vehicle assessment/repair");
    }
    if (impacted.otherService) {
      s.push(impacted.otherService);
    }
    
    return s.join(", ");
  };
  
  const today = () => {
    const today = new Date();
    return today.toLocaleDateString();   
  };
  
  const saveNote = (e) => {
    setData({
      ...data, 
      loading : true,
    });
    
    postNote(e.target.dataset.ts, data, setData);
  };
  
  const updateNote = (e) => {
    const v = e.target.value;
    const t = e.target.dataset.ts;
    
    data.subdata[t]['newNote'] = v;
    
    setData({
      ...data,
      subdata : data.subdata,
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

        <Accordion.Root collapsible variant="subtle">
          {data.subkeys.map((ts, index) => (
            <Accordion.Item key={ts} value={ts}>
              <Accordion.ItemTrigger>
                <Span flex="1">{displayTimestamp(ts)}</Span>
                <Span flex="1">
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field value={data.subdata[ts].status} onChange={updateStatus}>
                        <option value="new">New</option>
                        <option value="in process">In Process</option>
                        <option value="need info">Need Info</option>
                        <option value="complete">Complete</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Span>
                <Span flex="1" dangerouslySetInnerHTML={{__html: peopleTown(data.subdata[ts])}}></Span>
                
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
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key={ts}>
                        <Table.Cell>{displayTimestamp(ts)}</Table.Cell>
                        <Table.Cell>{"them" === data.subdata[ts].content.forWhom ? 'somone else' : 'myself'}</Table.Cell>
                        <Table.Cell>{("myself" === data.subdata[ts].content.forWhom) ? "me" : item.content.contact}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>

                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Whom?</Table.ColumnHeader>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Language</Table.ColumnHeader>
                        <Table.ColumnHeader>Phone</Table.ColumnHeader>
                        <Table.ColumnHeader>Signal</Table.ColumnHeader>
                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                        <Table.ColumnHeader>Share?</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key={ts}>
                        <Table.Cell>me</Table.Cell>
                        <Table.Cell>{data.subdata[ts].content.user.name}</Table.Cell>
                        <Table.Cell>{data.subdata[ts].content.user.primaryLanguage}</Table.Cell>
                        <Table.Cell dangerouslySetInnerHTML={{__html: formatPhone(data.subdata[ts].content.user)}}></Table.Cell>
                        <Table.Cell>{data.subdata[ts].content.user.signal}</Table.Cell>
                        <Table.Cell dangerouslySetInnerHTML={{__html: formatEmail(data.subdata[ts].content.user.email)}}></Table.Cell>
                        <Table.Cell>
                          { 
                            (data.subdata[ts].content.user.shareOK) ? 
                            <Badge colorPalette="green">Yes</Badge> :
                            <Badge colorPalette="red">No</Badge>
                          }
                        </Table.Cell>                        
                      </Table.Row>
                    </Table.Body>
                    { data.subdata[ts].content.them && 
                    <Table.Body>
                      <Table.Row key={ts}>
                        <Table.Cell>them</Table.Cell>
                        <Table.Cell>{data.subdata[ts].content.them.name}</Table.Cell>
                        <Table.Cell>{data.subdata[ts].content.them.primaryLanguage}</Table.Cell>
                        <Table.Cell dangerouslySetInnerHTML={{__html: formatPhone(data.subdata[ts].content.them)}}></Table.Cell>
                        <Table.Cell>{data.subdata[ts].content.them.signal}</Table.Cell>
                        <Table.Cell dangerouslySetInnerHTML={{__html: formatEmail(data.subdata[ts].content.them.email)}}></Table.Cell>
                        <Table.Cell>
                          { 
                            (data.subdata[ts].content.them.shareOK) ? 
                            <Badge colorPalette="green">Yes</Badge> :
                            <Badge colorPalette="red">No</Badge>
                          }
                        </Table.Cell>                        
                      </Table.Row>
                    </Table.Body>
                    }
                  </Table.Root>
                  
                  { (data.subdata[ts].content.impacted.needFinancial && (data.subdata[ts].content.impacted.payment.length > 0)) && 
                  
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>cashApp</Table.ColumnHeader>
                        <Table.ColumnHeader>Venmo</Table.ColumnHeader>
                        <Table.ColumnHeader>PayPal</Table.ColumnHeader>
                        <Table.ColumnHeader>Bank</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="cashApp">
                        <Table.Cell>
                      {
                        data.subdata[ts].content.impacted.payment.includes("cashApp") && 
                        <>{data.subdata[ts].content.impacted.cashAppHandle} ({data.subdata[ts].content.impacted.cashAppLast4})</>
                      }
                        </Table.Cell>
                        <Table.Cell>
                      {
                        data.subdata[ts].content.impacted.payment.includes("venmo") && 
                        <>{data.subdata[ts].content.impacted.venmoHandle} ({data.subdata[ts].content.impacted.venmoLast4})</>
                      }
                        </Table.Cell>
                        <Table.Cell>
                      {
                        data.subdata[ts].content.impacted.payment.includes("paypal") && 
                        <>{data.subdata[ts].content.impacted.paypalHandle}</>
                      }
                        </Table.Cell>
                        <Table.Cell>
                      {
                        data.subdata[ts].content.impacted.payment.includes("bank") && 
                        <>{data.subdata[ts].content.impacted.bankFirst} {data.subdata[ts].content.impacted.bankLast} 
                        {data.subdata[ts].content.impacted.bankMobile} {data.subdata[ts].content.impacted.bankEmail}</>
                      }
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                  }
                  
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Address For</Table.ColumnHeader>
                        <Table.ColumnHeader>Address</Table.ColumnHeader>
                        <Table.ColumnHeader>City, State, Zip</Table.ColumnHeader>
                        <Table.ColumnHeader>Housing Type</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="impactedAddress">
                        <Table.Cell>
                          Impact Location
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.placeImpacted}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.impactedCity} 
                          {data.subdata[ts].content.impacted.impactedCity ? ', ' + data.subdata[ts].content.impacted.impactedState : data.subdata[ts].content.impacted.impactedState}
                          {data.subdata[ts].content.impacted.impactedZip}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.housingType} &nbsp; 
                          ({data.subdata[ts].content.impacted.housingOwnership})
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row key="supportAddress">
                        <Table.Cell>
                          Support Location
                        </Table.Cell>
                        <Table.Cell>
                          {supportLocation(data.subdata[ts].content.impacted)}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.supportCity}
                          {data.subdata[ts].content.impacted.supportCity ? ', ' + data.subdata[ts].content.impacted.supportState : data.subdata[ts].content.impacted.supportState}
                          {data.subdata[ts].content.impacted.supportZip}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.supportPerson ? 'in care of ' + data.subdata[ts].content.impacted.supportPerson : ''}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>

                  { ("rented" === data.subdata[ts].content.impacted.housingOwnership) &&
                  
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Renter&rsquo;s Insurance?</Table.ColumnHeader>
                        <Table.ColumnHeader>Flood Insurance?</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="rentersInsurance">
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.rentersInsurance}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.floodInsurance}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                  
                  }

                  { ("owned" === data.subdata[ts].content.impacted.housingOwnership) &&
                  
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Home Insurance?</Table.ColumnHeader>
                        <Table.ColumnHeader>Flood Insurance?</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="homeInsurance">
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.homeInsurance}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.floodInsurance}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                  
                  }

                  { (data.subdata[ts].content.disaster.flood && "unhoused" !== data.subdata[ts].content.impacted.housingOwnership) && 
                  
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>How much flooding?</Table.ColumnHeader>
                        <Table.ColumnHeader>Flooding where?</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="floodAmount">
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.floodAmount}
                        </Table.Cell>
                        <Table.Cell>
                          {"other" === data.subdata[ts].content.impacted.floodWhere ? data.subdata[ts].content.impacted.otherFloodingWhere : data.subdata[ts].content.impacted.floodWhere}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>                  
                  
                  }
                  
                  { data.subdata[ts].content.disaster.snow &&

                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Need shoveling?</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="shoveling">
                        <Table.Cell>
                          {"other" === data.subdata[ts].content.impacted.shoveling ? data.subdata[ts].content.impacted.otherShoveling : data.subdata[ts].content.impacted.shoveling}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>                  
                  
                  }

                  { data.subdata[ts].content.disaster.heat &&
                  
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Elders?</Table.ColumnHeader>
                        <Table.ColumnHeader>Chronic Illness?</Table.ColumnHeader>
                        <Table.ColumnHeader>Med. Sensitive?</Table.ColumnHeader>
                        <Table.ColumnHeader>Infant?</Table.ColumnHeader>
                        <Table.ColumnHeader>Other?</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="heat">
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.elders ? 'Yes' : ''}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.chronicIllness ? 'Yes' : ''}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.medSenstivity ? 'Yes' : ''}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.infant ? 'Yes' : ''}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.heatOther ? data.subdata[ts].content.impacted.heatOtherValue : ''}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>                  

                  }
                  
                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Type</Table.ColumnHeader>
                        <Table.ColumnHeader>Needed</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="supplies">
                        <Table.Cell>
                          Supplies
                        </Table.Cell>
                        <Table.Cell>
                          {supplies(data.subdata[ts].content.impacted)}
                        </Table.Cell>
                      </Table.Row>
                     <Table.Row key="support">
                        <Table.Cell>
                          Support
                        </Table.Cell>
                        <Table.Cell>
                          {support(data.subdata[ts].content.impacted)}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>

                  <Table.Root size="sm" mt='5'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Other Info:</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      { data.subdata[ts].content.impacted.stormDamage && 
                      
                      <Table.Row key="stormDamage">
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.stormDamage}
                        </Table.Cell>
                      </Table.Row>                      
                      
                      }
                      <Table.Row key="whatElse">
                        <Table.Cell>
                          {data.subdata[ts].content.impacted.whatElse}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>

                  <Table.Root size="sm" mt='5'>
                    <Table.ColumnGroup>
                      <Table.Column htmlWidth="10%" />
                      <Table.Column htmlWidth="10%" />
                      <Table.Column />
                      <Table.Column htmlWidth="5%" />
                    </Table.ColumnGroup>                    
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                        <Table.ColumnHeader>By</Table.ColumnHeader>
                        <Table.ColumnHeader>Notes</Table.ColumnHeader>
                        <Table.ColumnHeader>&nbsp;</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row key="currentNote">
                        <Table.Cell>
                          {today()}
                        </Table.Cell>
                        <Table.Cell>
                          {data.username}
                        </Table.Cell>
                        <Table.Cell>
                          <Textarea variant="outline" onChange={updateNote} 
                          data-ts={ts} value={data.subdata[ts].newNote}
                          style={{backgroundColor: "#FFFFC5"}} />
                        </Table.Cell>
                        <Table.Cell>
                          <Button colorPalette="green" variant="solid" onClick={saveNote}
                            data-ts={ts}
                            loading={data.loading} loadingText="Encrypting & Saving...">
                            Save
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                      
                      {Object.keys(data.subdata[ts].notes).reverse().map((nts, index) => (
                      
                      <Table.Row key={index}>
                        <Table.Cell>
                          {displayTimestamp(data.subdata[ts].notes[nts].timestamp)}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].notes[nts].user}
                        </Table.Cell>
                        <Table.Cell>
                          {data.subdata[ts].notes[nts].content}
                        </Table.Cell>
                        <Table.Cell>
                          { /* conditional edit for admims */ }
                        </Table.Cell>
                      </Table.Row>
                      
                      
                      ))}
                      
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



export default Dashboard;