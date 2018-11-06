import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js'


class ProfileUserEdit extends React.Component{

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

    handleBioChange () {

    }

    handleLocationChange () {

    }

    onFileChange (e) {
        console.log(e.target.files[0]);

    }
    save (e) {

    }

    render() {
        let Render;
        Render = 
        <div id = "edit" className="w3-col m15 w3-row-padding">
            
            <div className="w3-card w3-round w3-white">
              <div  style = {{paddingBottom:'10px'}} className="w3-container">
              <h2> Edit Profile </h2>
               <h6 className="w3-center">{this.state.profileAddr}</h6>
               <div className="w3-center">
                <p className="w3-center"><img src={this.state.profileImg} className="w3-circle" style={{height:"200px",width:"200px"}} alt="Avatar"/></p>
                <input id="save" type="file" accept=".jpeg, .jpg, .jpe, .png" onChange={this.onFileChange.bind(this)} />
    
               </div>
               <hr/>
               <p><i className="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> <input onChange={this.handleBioChange.bind(this)} className="form-control" id="bio" placeholder="My bio..." type="text"/></p>
               <p><i className="fa fa-home fa-fw w3-margin-right w3-text-theme"></i> <input onChange={this.handleLocationChange.bind(this)} className="form-control" id="Location" placeholder="Location..." type="text"/> </p>
               {/* <p><i className="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> <input onChange={this.handleToAddrChange.bind(this)} className="form-control" id="toAddr" placeholder="0x4e221b..." type="text"/> </p> */}
               <button onClick={this.save.bind(this)} id="save" type="button" className="w3-button w3-theme"><i ></i> &nbsp;Save</button> &nbsp;
              </div>
            </div>
            <br/>
        </div>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileUserEdit);