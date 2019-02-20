import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import 'jquery';

import base64img from '../../startup/client/lib/base64img.js'

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
import Comments from '../pages/Comments.jsx';



export default class MainLayout extends React.Component {
  
  componentWillMount(){

    this.setState({
      gif:
        "data:image/gif;base64, "+ base64img.base64Gif
    })

    this.autoRun = Tracker.autorun(()=>{
      this.setState({
            ipfsInit: Session.get('ipfsConnected')
      });
    })

    if(!LocalStore.get('nodeURL')) {
      LocalStore.set('nodeURL', "https://rpc.doubleplus.io/");
    }
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

    Session.set('ipfsAPI','')
    Session.set('IpfsCompanion', false);

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
  
  reload() {
    document.location.reload(true);
  }
  
  render() {

    if(this.state.ipfsInit) {


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
                <Route path = '/comments/:itemid' component={Comments} />
                
                <Route component={Home} />
              </Switch>
        
          </div>
          </div>

        </div>
      </Router>
    );
    } else {
      let render = 
      <div>
          <div className="modal" id="ipfsModal" style = {{paddingTop:'50px'}}>
          <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                  <div className="modal-header">
                      <h5 className="modal-title">IPFS Daemon Starting...</h5>

                  </div>
                  <div className="modal-body">
                      <div className = "w3-center w3-container w3-padding">
                          <img src = {this.state.gif}/>

                      </div>
                  </div>
                  <p className = "w3-center">This may take up to 15 seconds the first time.  Currently browser IPFS isn't compatible with FireFox.</p>
                  <div className="modal-footer">
                      <span style={{float:"right"}}>Taking too long? Try refreshing.</span>
                      <button type="button"  className="btn btn-light" onClick={this.reload.bind(this)}>Refresh</button>
                  </div>
              </div>
          </div>
        </div> 
      </div>


      $('#ipfsModal').show();

      return(render)

    }
  }
}
