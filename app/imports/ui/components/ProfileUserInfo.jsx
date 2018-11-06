import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js'

class ProfileUserInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
                    profileAddr:this.props.profileAddr,
                    isMine: Session.get('addr')==this.props.profileAddr
        };
    }

    componentWillMount(){
        this.setState({
            profileImg: "data:image/jpeg;base64, " + base64img.defaultProfileImg
  
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;
        Render = 
        <div className="w3-col m3">
            <div className="w3-card w3-round w3-white">
              <div className="w3-container">
               <h6 className="w3-center">{this.state.profileAddr}</h6>
               <p className="w3-center"><img src={this.state.profileImg} className="w3-circle" style={{height:"106px",width:"106px"}} alt="Avatar"/></p>
               <hr/>
               <p><i className="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> Software Dev</p>
               <p><i className="fa fa-home fa-fw w3-margin-right w3-text-theme"></i> US </p>
               <p><i className="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> June 9, 1990 </p>
              </div>
            </div>
            <br/>
        </div>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileUserInfo);