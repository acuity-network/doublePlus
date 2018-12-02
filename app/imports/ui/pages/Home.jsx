import React from 'react';
import { withRouter } from 'react-router-dom';
import MixStats from '../components/MixStats.jsx'
import IpfsStats from '../components/IpfsStats.jsx'
import AccountRouter from '../components/AccountRouter.jsx'
import base64img from '../../startup/client/lib/base64img.js'

//console.log(base64Gif);

class Home extends React.Component {
  
  constructor(props){
    super(props);

    this.state = { gif:
        "data:image/gif;base64, "+ base64img.base64Gif
    };
  }

  componentWillMount(){
    
    this.autoRun = Tracker.autorun(()=>{
        this.setState({
            loggedIn: Session.get('loggedIn'),
            isBrowserIpfs: LocalStore.get('browserIpfs'),
            ipfsConnected: Session.get('ipfsConnected')
        });
    })
    
  };

  componentWillUnmount() {
      this.autoRun.stop();
  };

  componentDidMount() {
    if(!this.state.ipfsConnected){
        $('#ipfsModal').show();
    }
  }

  handleClick() {
    $('#ipfsModal').hide();
  }

  route (link) {
      this.props.history.push(link)
  };


  render() {
      let Render;
      Render = 
      <div className="w3-row">
       
        <div className="w3-col m9">
        <AccountRouter/>
        
                <div className="w3-card w3-round w3-white">
                    <div className="w3-center w3-container w3-padding">
                    
                    {/* <h1  >
                        Welcome to the Decentralized Web!
                    </h1> */}
                    {/* <img style={{paddingTop:'30px'}} src="/img/spin-2.gif" /> */}
                    <img style={{paddingTop:'30px'}} src={this.state.gif} />
                    <br/>
                    <br/>
                    <br/>
                    {!this.state.loggedIn ? <div>
                    
                    <button onClick={this.route.bind(this,'/login')} style={{width:"60%"}} type="button" className="w3-button w3-theme btn-lg">Login</button>
                    <br/>
                    <br/>
                    <button onClick={this.route.bind(this, '/create')} style={{width:"60%"}} type="button" className="w3-button w3-theme btn-lg">Create Account</button>
                    <br/>
                    <br/>
                    </div>:''}
                    </div>
                </div>
            </div>

        <MixStats/>
        <IpfsStats/>

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
                    <div className="modal-footer">
                        <button type="button" onClick={this.handleClick.bind(this)} className="w3-button w3-theme" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div> 
    </div>
  

      if(this.state.ipfsConnected) {
        $('#ipfsModal').hide();
      }
        
      return(Render);
  };
}

export default withRouter(Home);
