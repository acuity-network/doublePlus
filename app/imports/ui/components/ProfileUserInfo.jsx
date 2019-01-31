import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js'
import { log } from 'util';

class ProfileUserInfo extends React.Component{

    constructor(props){
        super(props);
        

        this.state = {
            profileAddr:this.props.profileAddr,
            profileId: this.props.profileId,
            isMine: this.props.isMine,
            profileObject: this.props.profileObject,
            latestProfileRevision: null,
            location: null,
            type: null,
            bio: null,
            name: null
        
        }

    }

    componentWillMount(){

        let img = "data:image/jpeg;base64, " + base64img.defaultProfileImg;
   
            this.setState( {
                location: this.state.profileObject.location,
                type: this.state.profileObject.type,
                bio: this.state.profileObject.bio,
                name: this.state.profileObject.name,
                profileImg: img
            });

        MixUtil.getImageFromMipmap(this.state.profileObject.image, 256,256)
        .then(data=>{
           if(data) {   
                this.setState( {
                    profileImg: "data:image/jpeg;base64, " + SessionUtil.arrayBufferToBase64(data)
                });
            }

        })
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    follow () {
        MixUtil.followUser(Session.get('addr'), this.state.profileAddr);

    };

    render() {
        let Render;
        Render = 
        <div className="w3-col m3">
            <div className="w3-card w3-round w3-white">
              <div className="w3-container">
               <h3 className="w3-center">{this.state.name}</h3>
               <p className="w3-center"><img src={this.state.profileImg} className="w3-circle" style={{height:"106px",width:"106px"}} alt="Avatar"/></p>
               <hr/>
               <p><i className="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> {this.state.bio}</p>
               <p><i className="fa fa-home fa-fw w3-margin-right w3-text-theme"></i> {this.state.location}</p>
               {/* <p><i className="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> June 9, 1990 </p> */}
               { !this.state.isMine ? 
               <div>
                   { Session.get('loggedIn') ?
                    <div style={{paddingBottom: '10px'}}>
                        <button onClick={this.follow.bind(this)} style={{width:"100%"}} type="button" className="w3-button  btn-success btn-sm">Follow</button>
                    </div>
                    :''
                    }
                    <div style={{paddingBottom: '20px'}}>
                        <button onClick={this.route.bind(this,'/feed/'+this.state.profileAddr)} style={{width:"100%"}} type="button" className="w3-button  btn-light btn-sm">View {this.state.name}'s Feed</button>
                    </div>
                </div>
               :""
               }
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