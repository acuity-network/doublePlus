import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'jquery';

import Header from '../components/Header.jsx';
import Home from '../pages/Home.jsx';
import NotFound from '../pages/NotFound.jsx';
import Login from '../pages/Login.jsx';
import Trusted from '../pages/Trusted.jsx';
import Wallet from '../pages/Wallet.jsx';
import Settings from '../pages/Settings.jsx';
import Explore from '../pages/Explore.jsx';
import Create from '../pages/Create.jsx';
import Profile from '../pages/Profile.jsx';
import Loading from '../components/Loading.jsx';
import SidePanel from '../components/SidePanel.jsx';
import NavBar from '../components/NavBar.jsx';
import Feed from '../pages/Feed.jsx';



export default class MainLayout extends React.Component {
  
  componentWillMount(){

    this.autoRun = Tracker.autorun(()=>{
      this.setState({
            
            
          
      });
    })



    if(!LocalStore.get('nodeURL')) {
      LocalStore.set('nodeURL', "https://rpc.doubleplus.io/");
    }
    console.log(LocalStore.get('nodeURL'));
    if(!LocalStore.get('ipfsApiURL')) {
        LocalStore.set('ipfsApiURL', "localhost");
    }
    if(!LocalStore.get('ipfsGatewayURL')) {
        LocalStore.set('ipfsGatewayURL', "https://ipfs.infura.io/");
    }
    if(!LocalStore.get('protocol')) {
      LocalStore.set('protocol', 'http');
    }
    if(LocalStore.get('browserIpfs') == null) {
      LocalStore.set('browserIpfs', true)
    }

    Session.set('isMobile', (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1));
  
    Web3Util.initWeb3();
  
    IpfsUtil.initIPFS();
    if(Meteor.isClient) {
      persistentTransactionDb = new Mongo.Collection('transaction-Db', null);
      profileDb = new Mongo.Collection(null);
  
      transactionDb = new PersistentMinimongo(persistentTransactionDb);
      transactionDb.refresh();
    }
    
  };

  componentWillUnmount() {
    this.autoRun.stop();
  };
  
  
  render() {
    

    return (
      
      <Router>

        <div className="wrapper">
        < SidePanel />
          <div id="content">
            <NavBar /> 
       
          <div className="w3-container w3-content" style={{maxWidth:'1700px',marginTop:'20px'}}>  
          
      
              
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path = '/login' component={Login} />
                <Route path = '/trusted' component={Trusted} />
                <Route path = '/wallet' component={Wallet} />
                <Route path = '/settings' component={Settings} />
                <Route path = '/explore' component={Explore} />
                <Route path = '/create' component={Create} />
                <Route path = '/feed/:address' component={Feed} />
                <Route path = '/profile/:address' component={Profile} />
                
                <Route component={Home} />
              </Switch>
        
          </div>
          </div>

        </div>
      </Router>
    );
  }
}
