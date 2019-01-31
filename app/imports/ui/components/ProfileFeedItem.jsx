import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js';
import ReplyBox from './ReplyBox.jsx';
const web3 = require('web3');


class ProfileFeedItem extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            item: this.props.item,
            reply:false,
            replyCount:0,
            donations:0,
            replies:[],
            isMine:false

        };

    };


    componentWillMount(){

        //if not initalized then initalize
        if(this.state.item) {
            if(!this.state.item.item) {
                this.state.item.init()
                .then(_item => {
                    this.intitalizeStateItems(_item);
                })
            } else {
                this.intitalizeStateItems(this.state.item);
            }
        }
    };

    componentWillReceiveProps(nextProps) {

         //if not initalized then initalize
         if(nextProps.item) {
            if(!nextProps.item.item) {
                nextProps.item.init()
                .then(_item => {
                    this.intitalizeStateItems(_item);
                })
            } else {
                this.intitalizeStateItems(nextProps.item);
            }
        }
    }

    intitalizeStateItems(_item) {

        this.setState({
            profileImg: "data:image/jpeg;base64, " + base64img.defaultProfileImg
        });

        this.setState({
            owner:_item.owner(),
            itemId:_item.itemId,
            loggedIn:Session.get('loggedIn'),

        })
        if(Session.get('loggedIn')) {
            this.setState({
                isMine: (web3.utils.toChecksumAddress(_item.owner()) == web3.utils.toChecksumAddress(Session.get('addr'))),
            })
        }
    
        MixUtil.getComments(_item.itemId)
        .then(_comments => {
            this.setState({
                replies:_comments,
                replyCount:_comments.length

            })
        })

        MixUtil.getBlurbInfo(_item.itemId)
        .then(blurbInfo =>{
            this.setState({
                donations: web3.utils.fromWei(blurbInfo.donationsReceived,"ether"),
                blurbType: blurbInfo.blurbType
            })
        })

        MixUtil.getProfileLocalDb(_item.owner())
        .then(_profile => {

            this.setState({
                name:_profile.name,
                bio:_profile.bio,
                location:_profile.location,
                type:_profile.type
            })

            MixUtil.getImageFromMipmap(_profile.image, 256,256)
            .then(data=>{
                if(data) {  
                    this.setState( {
                        profileImg: "data:image/jpeg;base64, " + SessionUtil.arrayBufferToBase64(data)
                    });
                }
                
            })
        });
        
        _item.latestRevision().load()
        .then(_revision => {
            this.setState({
                bodyText: _revision.getBodyText(),
                timeStamp: moment.unix(_revision.getTimestamp()).format('YYYY MM DD, h:mm a'),

            });
        })

    };
        

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    handleReplyChange(e) {
        if(!this.state.loggedIn) {
            this.route('/login');
        } else {
            this.setState({
                reply:!this.state.reply,
            });
        }

    };

    handleDonate(e) {

        let notify = 
        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            title: '',
            message: 'Donating to Item Owner!',
            target: '_blank',
            allow_dismiss: false,
          },{
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            type:'info',
            showProgressbar: false,
            placement: {
                from: "bottom",
                align: "center"
            }
          });

          MixUtil.donateToItem(Session.get('addr'),this.state.itemId, notify);

    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;
        console.log(this.props.blurbType, this.state.blurbType);
        if(this.props.blurbType == this.state.blurbType) {
            Render = 
            <div className="w3-container w3-card w3-white w3-round w3-margin"><br/>
                <img  src = {this.state.profileImg} alt="Avatar" className="w3-left w3-circle w3-margin-right" style={{width:'60px'}}/>
                <span className="w3-right w3-opacity">{this.state.timeStamp}</span>
                <h3>{this.state.name}</h3> <a onClick={this.route.bind(this,'/profile/'+this.state.owner)} > {this.state.owner}</a>
                
                <hr className="w3-clear"/>
                <p style={{paddingBottom:"10px",fontSize:"20px"}}> &nbsp; {this.state.bodyText}</p>
                {(!this.state.isMine && this.state.loggedIn) &&
                    <span style={{paddingRight:'10px'}}>
                        <button type="button" onClick={this.handleDonate.bind(this)} className="btn btn-success w3-margin-bottom"><i className="fa fa-money"></i> &nbsp;Send a Mix</button>
                    </span>
                }
                <button type="button" onClick={this.handleReplyChange.bind(this)} className="btn w3-theme-d2 w3-margin-bottom"><i className="fa fa-comment"></i> &nbsp; {this.state.reply ? 'Cancel': 'Reply'}</button> 
                <span className="w3-right w3-opacity"> <a onClick={this.route.bind(this, '/comments/'+ this.state.itemId) }> Replies: {this.state.replyCount}</a> </span>
                <span className="w3-right w3-opacity">  Mix Received: {this.state.donations} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                {this.state.reply &&
                    <div style={{ paddingBottom:"20px"}}>
                        <ReplyBox parentItemId = {this.state.itemId}/>
                    </div>
                }
            </div>  
        } else Render = "";
        
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileFeedItem);