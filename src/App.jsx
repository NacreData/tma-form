import logo from './assets/logo.svg'
import './App.css'
import { Grid, GridItem } from "@chakra-ui/react"
import PageOne from './PageOne.jsx';
import ForWhom from './ForWhom.jsx';
import You from './You.jsx';
import Them from './Them.jsx';
import PageTwo from './PageTwo.jsx';
import Thx from './Thx.jsx';
import { useDataStore } from "./DataStoreProvider";
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import CaseDetail from './CaseDetail.jsx';
import Profile from './Profile.jsx';
import Admin from './Admin.jsx';

function Routing() {
  const { data } = useDataStore();
  
  if ('start' === data.page) {
    return (<ForWhom />);
  }
  else if ('one' === data.page) {
    return (<PageOne />);
  }
  else if ('you' === data.page) {
    return (<You />);
  }
  else if ('them' === data.page) {
    return (<Them />);
  }
  else if ('two' === data.page) {
    return (<PageTwo />);
  }
  else if ('thx' === data.page) {
    return (<Thx />);
  }
  else if ('login' === data.page) {
    return (<Login />);
  }
  else if ('dashboard' === data.page) {
    return (<Dashboard />);
  }
  else if ('case' === data.page) {
    return (<CaseDetail />);
  }
  else if ('profile' === data.page) {
    return (<Profile />);
  }
  else if ('admin' === data.page) {
    return (<Admin />);
  }
}


function App() {
  const { data } = useDataStore();
  
  if (data.token) {
    return (<Routing />);
  }
  else {
    return (
      <>
        <section id="center">  
  
          <Grid templateColumns="repeat(2, 1fr)" gap="6">
            <GridItem>
              <img style={{width: '50%'}}  src={logo} className="framework" alt="TMA logo" />          
            </GridItem>
            <GridItem>
              <h1>Disaster Needs</h1>
              <h1>Request Form</h1>
            </GridItem>
          </Grid>      
              
        </section>
        
        <Routing />
      </>
    );  
  }
}

export default App
