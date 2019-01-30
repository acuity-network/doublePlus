import React from 'react';
import { withRouter } from 'react-router-dom';
import MixStats from '../components/MixStats.jsx'
import IpfsStats from '../components/IpfsStats.jsx'
import AccountRouter from '../components/AccountRouter.jsx'
import base64img from '../../startup/client/lib/base64img.js'

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
       
        <div className="w3-col m9 w3-row-padding" style={{paddingBottom:"20px"}}>
        <AccountRouter/>
        
                <div className="w3-card w3-round w3-white">
                    <div className="w3-center w3-container w3-padding">
                    {/* <h1  >
                        Welcome to the Decentralized Web!
                    </h1> */}
                    {/* <img style={{paddingTop:'30px'}} src="/img/spin-2.gif" /> */}
                    {/* <h3>About doublePlus</h3>
                    <h4 style={{width:'75%',paddingTop:'20px', textAlign:'left',margin:'auto'}}>
                        &nbsp; &nbsp;&nbsp;DoublePlus is a second generation decentralized social network, where users are free to connect, share ideas, thoughts and information without restrictions. <br /> <br />
                        &nbsp;&nbsp;&nbsp; DoublePlus uses a combination of the Mix Blockchain and decentralized file sharing(IPFS) to create an environment where users connect directly with each other and not through a corporation.  Solving many problems that exist with modern social networks (censorship, agenda pushing, data collection, privacy issues, advertisements, and others).  DoublePlus also has a donation system to directly monetarily reward quality content.
                        <br /><br />&nbsp;&nbsp;&nbsp; For any questions, guides on getting started, or some MIX so you can start posting feel free to join the <a href= "https://discord.gg/vd7dknY" >Mix-Blockchain Discord channel</a>.
                    </h4>
                    <br/><br/><br/> */}
                    <img style={{paddingTop:'30px'}} src={this.state.gif} />
                    <br/><br/><br/>
                    {!this.state.loggedIn ? <div>
                    
                    <button onClick={this.route.bind(this,'/login')} style={{width:"60%"}} type="button" className="w3-button  btn-success btn-lg">Login</button>
                    <br/><br/>
                    <button onClick={this.route.bind(this, '/create')} style={{width:"60%"}} type="button" className="w3-button btn-lg btn-light">Create Account</button>
                    <br/><br/>
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
                    <p className = "w3-center">This may take up to 15 seconds the first time.  Currently browser IPFS isn't compatible with FireFox.</p>
                    <div className="modal-footer">
                        <button type="button" onClick={this.handleClick.bind(this)} className="btn btn-danger" data-dismiss="modal">Close</button>
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
