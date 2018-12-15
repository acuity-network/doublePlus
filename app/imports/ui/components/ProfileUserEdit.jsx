import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js'
import profileProto from '../../startup/client/lib/protobuf/account-profile_pb.js'
import languageProto from '../../startup/client/lib/protobuf/language_pb.js'
import titleProto from '../../startup/client/lib/protobuf/title_pb.js'
import bodyTextProto from '../../startup/client/lib/protobuf/body_pb.js'
import MixContent from '../../startup/client/classes/MixContent.js'
import Image from '../../startup/client/classes/image.js'


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

    handleBioChange (e) {
        this.setState({
            bio: e.target.value
        })

    }

    handleLocationChange (e) {
        this.setState({
            location: e.target.value
        })

    }

    onFileChange (e) {
        try {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = event => {
                console.log(event.target.result)
            };
            this.setState({
                image:reader.readAsArrayBuffer(file)
            })
            console.log(reader.readAsArrayBuffer(file));
        } catch(e) {
            console.log(e, "image upload error");
        }

    };

    save () {

        let content = new MixContent();
        // Account profile
        let profileMessage = new profileProto.AccountProfile();
        profileMessage.setType(this.state.type);
        profileMessage.setLocation(this.state.location);
        content.addMixin(0x4bf3ce07, profileMessage.serializeBinary());
        // Language
        let languageMessage = new languageProto.LanguageMixin();
        languageMessage.setLanguageTag('en-US');
        content.addMixin(0x4e4e06c4, languageMessage.serializeBinary());
        // Title
        let titleMessage = new titleProto.TitleMixin();
        titleMessage.setTitle(this.state.name);
        content.addMixin(0x24da6114, titleMessage.serializeBinary());
        // BodyText
        let bodyTextMessage = new bodyTextProto.BodyTextMixin();
        bodyTextMessage.setBodyText(this.state.bio);
        content.addMixin(0x34a9a6ec, bodyTextMessage.serializeBinary());
        // Image
        if (this.state.image) {
            let image = new Image(this.state.image)
            //   image.createMixin()
            //   .then(img => {
            //     content.addMixin(0x12745469, img);
            //     console.log(content);
            //   })
            image.scaleImage(400,400)
            .then(scaled=>{
                console.log(scaled)
            })
          
        }
        console.log(content);
        content.save()
        .then((res)=>{
            console.log(res);
            console.log(Session.get('addr'));
            MixUtil.createOrReviseMyProfile(res, Session.get('addr'));
            
        });

    }

    handleTypeChange (e) {
        this.setState({
            type: e.target.value
        })
    }

    handleNameChange (e) {
        this.setState({
            name: e.target.value
        })

    }

    render() {
        let Render;
        Render = 
        <div style ={{margin:'auto', maxWidth:'800'}}>
        <div id = "edit"  className="w3-col m12 w3-row-padding">
            
            <div className="w3-card w3-round w3-white">
              <div  style = {{paddingBottom:'10px'}} className="w3-container">
              <h2> Edit Profile </h2>
               <h6 className="w3-center">{this.state.profileAddr}</h6>
               <div className="w3-center">
                <p className="w3-center"><img src={this.state.profileImg} className="w3-circle" style={{height:"200px",width:"200px"}} alt="Avatar"/></p>
                <label className = "w3-button w3-theme" htmlFor="avatar">Edit Picture</label>
                <input id="avatar" type="file" multiple={false} accept=".jpeg, .jpg, .jpe, .png" onChange={this.onFileChange.bind(this)} />
    
               </div>
               <hr/>
               <label htmlFor="name">Name:</label> <br/><input onChange={this.handleNameChange.bind(this)} className="form-control" id="name" placeholder="Name..." type="text"/> 
               <label htmlFor="bio">Bio:</label> <br/><input onChange={this.handleBioChange.bind(this)} className="form-control" id="bio" placeholder="My bio..." type="text"/>
               <label htmlFor="location">Location:</label> <br/><input onChange={this.handleLocationChange.bind(this)} className="form-control" id="location" placeholder="Location..." type="text"/> 
               
               <label htmlFor="typeChange">Profile Type: </label> <br/>
                <select defaultValue = '' style={{width:'40%'}} onChange = {this.handleTypeChange.bind(this)} className="form-control" id="typeChange">
                    <option value="0">Anon</option>
                    <option value="1">Person</option>
                    <option value="2">Project</option>
                    <option value="3">Organization</option>
                    <option value="4">Proxy</option>
                    <option value="5">Parody</option>
                    <option value="6">Bot</option>
                    <option value="7">Shill</option>
                    
                </select>
                <br/>
               {/* <p><i className="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> <input onChange={this.handleToAddrChange.bind(this)} className="form-control" id="toAddr" placeholder="0x4e221b..." type="text"/> </p> */}
               <button onClick={this.save.bind(this)} id="save" type="button" className="w3-button w3-theme"><i ></i> &nbsp;Save</button> &nbsp;
              </div>
            </div>
            <br/>
        </div>
        </div>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileUserEdit);