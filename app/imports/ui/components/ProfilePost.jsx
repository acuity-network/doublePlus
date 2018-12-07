import React from 'react';
import { withRouter } from 'react-router-dom';
import languageProto from '../../startup/client/lib/protobuf/language_pb.js'
import bodyTextProto from '../../startup/client/lib/protobuf/body_pb.js'
import MixContent from '../../startup/client/classes/MixContent.js'

class ProfilePost extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            charCount:0
         };
    }

    componentWillMount(){
        this.setState({
  
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    handlePostChange (e) {
        let _postText = e.target.value;
        let _charCount = e.target.value.length;
        console.log(_charCount);
        this.setState({
            postText: _postText,
            charCount : _charCount
        });

    };

    handlePostSubmit(e) {
        if(this.state.charCount>140) {

            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'Keep your post under 140 characters!',
                target: '_blank'
            },{
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                type:'danger',
                placement: {
                    from: "bottom",
                    align: "center"
                }
            });

        } else if (this.state.charCount<=0) {

            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'No blank post please!',
                target: '_blank'
            },{
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                type:'danger',
                placement: {
                    from: "bottom",
                    align: "center"
                }
            });

        } else {
        let notify = 
        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            title: '',
            message: 'Publishing post to IPFS!',
            target: '_blank',
            allow_dismiss: false,
          },{
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            type:'info',
            showProgressbar: true,
            placement: {
                from: "bottom",
                align: "center"
            }
          });


        let content = new MixContent();
        
        // Language
        let languageMessage = new languageProto.LanguageMixin();
        languageMessage.setLanguageTag('en-US');
        content.addMixin(0x4e4e06c4, languageMessage.serializeBinary());
        
        // BodyText
        let bodyTextMessage = new bodyTextProto.BodyTextMixin();
        bodyTextMessage.setBodyText(this.state.postText);
        content.addMixin(0x34a9a6ec, bodyTextMessage.serializeBinary());
        // Image
        // if (window.fileNames) {
        //   let image = new Image(this.$root, window.fileNames[0])
        //   content.addMixin(0x12745469, await image.createMixin())
        // }
        console.log(content);
        content.save()
        .then((ipfsHash)=>{
            notify.update('message', 'Item published to IPFS! Hash: ' + ipfsHash);
            notify.update('progress', 50);
            console.log(ipfsHash);
            MixUtil.postNewBlurb(Session.get('addr'),ipfsHash,Session.get('profile'), notify)
            .catch((e)=>{
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: '',
                    message: 'Error posting Blurb! ' + e.message,
                    target: '_blank'
                },{
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                    type:'danger',
                    placement: {
                        from: "bottom",
                        align: "center"
                    }
                });

            })
            
        });


        }



    };



    render() {
        let Render;
        Render = 
        <div className="w3-card w3-round w3-white">
            <div className="w3-container w3-padding">
                <h6 className="w3-opacity">Post to the MIX Network</h6>
                <div className="form-group loginText">
                    <textarea style={{ width: '100%'}}  onChange={this.handlePostChange.bind(this)} className="form-control" id="post" placeholder="Feeling Uncensorable!" type="text"/>
                </div>
                <button  onClick = {this.handlePostSubmit.bind(this)} style={{float: 'right'}} type="button" className="w3-button w3-theme"><i className="fa fa-pencil"></i> &nbsp;Post</button> 
                <span className="w3-right w3-opacity" style={{float: 'right'}}> {140 - this.state.charCount} &nbsp;&nbsp; </span>
                <button  type="button" className="w3-button w3-theme"><i className="fa fa-image"></i> &nbsp;Attach Img</button> 
            </div>
        </div>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfilePost);