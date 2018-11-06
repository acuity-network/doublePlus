import React from 'react';
import { withRouter } from 'react-router-dom';

class Header extends React.Component {

  componentWillMount(){
    Tracker.autorun(()=>{
      this.setState({
        isLogged : Session.get('loggedIn'),
        addr : Session.get('addr')     
      });
    });
  
  };

  login () { 
    console.log('here');
    SessionUtil.logIn();
    //await web3Util.initWeb3();
  };

  route (link) {
    this.props.history.push(link);
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


  }

  render() {
    let Render;

    if(Session.get('loggedIn'))  {

      Render = 
        <div className="w3-top">
        <div className="w3-bar w3-theme-d2 w3-left-align w3-large">
        <a className="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" ><i className="fa fa-bars"></i></a>
        <a onClick = { this.route.bind(this,'/') } className="w3-bar-item w3-button w3-padding-large w3-theme-d4"><i className="fa fa-home w3-margin-right"></i>Mix Hub</a>
        <a onClick = { this.route.bind(this,'/wallet/') } className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Wallet">Wallet</a>
        <a onClick = { this.route.bind(this,'/explore/') } className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Wallet">Explore Mix</a>
        <a onClick = { this.route.bind(this,'/trusted/') } className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Wallet">Trusted Accounts</a>
        <a onClick = { this.route.bind(this,'/profile/' + this.state.addr) } className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Wallet">My Profile</a>
        <a onClick = { this.route.bind(this,'/feed/') } className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Explore">Mix Feed</a>
        
        <a onClick = { this.route.bind(this,'/settings/') } className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white w3-right" title="Settings"> Settings <i className="fa fa-gear w3-margin-right"></i></a>
        <div className="w3-dropdown-hover w3-right w3-hide-small">
            <button className="w3-button w3-padding-large" title="Account"> { this.state.addr } <i className="fa fa-sort-down w3-margin-left"></i></button>     
            <div className="w3-dropdown-content w3-card-4 w3-bar-block" style={{width:'10px'}}>
              <a id="logout" onClick={this.logOut.bind(this)} className="w3-bar-item w3-button" >LogOut</a>
            </div>
              
        </div>
        
        </div>
      </div>;

    } else {
      Render = 
      <div className="w3-top">
      <div className="w3-bar w3-theme-d2 w3-left-align w3-large">
      <a className="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" ><i className="fa fa-bars"></i></a>
      <a onClick = { this.route.bind(this,'/') } className="w3-bar-item w3-button w3-padding-large w3-theme-d4"><i className="fa fa-home w3-margin-right"></i>Mix Hub</a>
      <a onClick = { this.route.bind(this,'/explore/') } className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Explore">Explore Mix</a>
      <a onClick = { this.route.bind(this,'/settings/') }className="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white w3-right" title="Settings"> Settings <i className="fa fa-gear w3-margin-right"></i></a>
      <div className="w3-dropdown-hover w3-right w3-hide-small">

          <button className="w3-button w3-padding-large" title="Account">Account <i className="fa fa-sort-down w3-margin-left"></i></button>     
            <div className="w3-dropdown-content w3-card-4 w3-bar-block" >
            
              <a onClick = { this.route.bind(this,'/login/') } className="w3-bar-item w3-button" >Login</a>
              <a onClick = { this.route.bind(this,'/create/') } className="w3-bar-item w3-button" >Create Account</a>
            </div>  
      </div>
      </div>
    </div>;
    }

    return (Render);
     
  }
}

export default withRouter(Header);
