
        
import React from 'react';
import { withRouter } from 'react-router-dom';
import clipboard from 'clipboard'; 

class SidePanel extends React.Component{

    constructor(props){
        super(props);
        // this.state = { 
        //     isLogged : Session.get('loggedIn'),
        //     addr : Session.get('addr'),
        //     balance :  Session.get('balance')

        // };
    }

    componentWillMount(){

        this.autoRun = Tracker.autorun(()=>{
            this.setState({
              isLogged : Session.get('loggedIn'),
              addr : Session.get('addr'),
              balance :  Session.get('balance')
              
            });
          });
    };
    
    
    route (link, toggle=false) {
        this.props.history.push(link)
        if(toggle && Session.get('isMobile')) {
            this.toggleHandle();
        }
    };

    toggleHandle () {
        $('#sidebar').toggleClass('active');
    };
    
      shouldComponentUpdate(lastState, nextState) {
        return true;
    
      };
    
      logOut () {
        SessionUtil.logOut();
        this.route('/');
    
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          title: '',
          message: 'Successfully logged out!',
          target: '_blank'
      },{
          animate: {
              enter: 'animated fadeInDown',
              exit: 'animated fadeOutUp'
          },
          type:'success',
          placement: {
              from: "bottom",
              align: "center"
          }
      });
    
      };

    componentWillUnmount() {
        this.autoRun.stop();
    };

    componentDidMount() {
        const clipButton = new clipboard('.addr', {
            text: () => {return Session.get('addr')}
        });


    };

    copyMyAddrClipBoard(e) {
    

        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            title: '',
            message: 'Copied my address to clipboard!',
            target: '_blank'
        },{
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            type:'info',
            placement: {
                from: "bottom",
                align: "center"
            }
        });

    }

    render() {

        let Render;
        
        if(Session.get('loggedIn')) {
            Render =        
                <nav id="sidebar">
                    <div className="sidebar-header">
                        <h3 style={{fontWeight:"bolder"}} >Double <br/> &nbsp; &nbsp; &nbsp;Plus ++</h3>
                    </div>
                    
                    <ul style={{fontWeight:'bold'}} className="list-unstyled components">
                        <li>
                            <a  onClick={this.route.bind(this, '/feed/'+Session.get('addr'),true)}>My Feed</a>
                        </li>
                        <li>
                            <a  onClick={this.route.bind(this, '/profile/'+Session.get('addr'),true)}>My Profile</a>
                        </li>
                        <li>
                            <a  onClick={this.route.bind(this, '/wallet',true)}>Wallet<span style={{float:'right', fontWeight:'lighter'}}>{Session.get('balance')} Mix</span></a>
                        </li>
                        <li>
                            <a  onClick={this.route.bind(this, '/trusted',true)}>Following</a>
                        </li>
                        <li>
                            <a  onClick={this.route.bind(this, '/faucet',true)}>Faucet</a>
                        </li>
                        <li>
                            <a  onClick={this.route.bind(this, '/settings',true)}>Settings</a>
                        </li>
                    </ul>
                    <ul className="list-unstyled CTAs">
                        <li>
                            <h5 id='addrField' className="addr" onClick={this.copyMyAddrClipBoard.bind(this)}> &nbsp; {(Session.get('addr') != null)? Session.get('addr').substr(0,12) + '...':''} <i  className="fa fa-clone w3-margin-left"></i> </h5>
                        </li>
                        <li>
                            <a  onClick={this.logOut.bind(this)} className="logOut">Log Out</a>
                        </li>

                    </ul>
                </nav>
            } else {
                Render = 

                <nav id="sidebar">
                    <div className="sidebar-header">
                        <h3 style={{fontWeight:"bolder"}} >Double <br/> &nbsp; &nbsp; &nbsp;Plus ++</h3>
                    </div>

                    <ul style={{fontWeight:'bold'}} className="list-unstyled components">
                        {/* <li>
                            <a  onClick={this.route.bind(this, '/feed/'+Session.get('addr'),true)}>My Feed</a>
                        </li> */}
                        <li>
                            <a  onClick={this.route.bind(this, '/settings',true)}>Settings</a>
                        </li>
                    </ul>
                    <ul className="list-unstyled CTAs">
                        <li>
                            <a  onClick={this.route.bind(this,'/login')} className="download">Login</a>
                        </li>
 
                        <li>
                            <a onClick={this.route.bind(this,'/create')} className="create">Create Account</a>
                        </li>
                    </ul>
                </nav>

            }


        return(Render);
    };


}

export default withRouter(SidePanel);




