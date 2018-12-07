import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfileUserInfo from '../components/ProfileUserInfo.jsx';
import ProfileFeed from '../components/ProfileFeed.jsx';
import ProfileUserEdit from '../components/ProfileUserEdit.jsx';
import Loading from '../components/Loading.jsx';
import MixItem from '../../startup/client/classes/MixItem.js'



class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            profileAddr: this.props.match.params.address,
            isMine: Session.get('addr') == this.props.match.params.address,
            loaded:false
        };
        console.log(Session.get('profile'))
        console.log(this.props.match.params.address);
    }

    componentWillMount(){

        MixUtil.getProfileLocalDb(this.state.profileAddr, true)
        .then(_profileObject => {
            
            if(_profileObject) {
                
    
                this.setState({
                    profileObject:_profileObject,
                    profileId:_profileObject.profileItemId,
                    loaded: true
                    
                })
           
            } else {
                this.setState({
                    profileId:null,
                    loaded: true
                });
            }

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
        //if is users page and user doesnt have a profile, show user edit
        if(this.state.isMine && !Session.get('profile')) {
        Render = 
            <div style ={{margin:'auto', maxWidth:'1200px'}}>
                <ProfileUserEdit/>
            </div>
            
        } else if(!this.state.loaded){
            Render =
                <Loading/>
        } else if(!this.state.profileId) {
            Render = 
                <h1>Profile doesn't exist</h1>
        
        } else {
            Render = 
                <div className="w3-row">       
                    <ProfileUserInfo profileObject = {this.state.profileObject} isMine = {this.state.isMine} profileId = {this.state.profileId} profileAddr={this.state.profileAddr}/>
                    <ProfileFeed profileObject = {this.state.profileObject} isMine = {this.state.isMine} profileId={this.state.profileId} profileAddr={this.state.profileAddr}/>
                </div>  
        }
      
        return(Render);
    };

    componentWillUnmount() {



    };

}

export default withRouter(Profile);