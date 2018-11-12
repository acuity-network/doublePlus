import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfileUserInfo from '../components/ProfileUserInfo.jsx';
import ProfileFeed from '../components/ProfileFeed.jsx';
import ProfileUserEdit from '../components/ProfileUserEdit.jsx';
import Loading from '../components/Loading.jsx';



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

        MixUtil.getProfile(this.state.profileAddr)
        .then((_profileId) => {
            this.setState({
                profileId:_profileId,
                loaded: true
            });

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
        if(! this.state.loaded){
            Render =
                <Loading/>
    
        } else if(this.state.isMine && !Session.get('profile')) {
        Render = 
            <div style ={{margin:'auto', maxWidth:'1200px'}}>
                <ProfileUserEdit/>
            </div>
            
        } else {
        Render = 
            <div className="w3-row">       
                <ProfileUserInfo isMine = {this.state.isMine} profileId = {this.state.profileId} profileAddr={this.state.profileAddr}/>
                <ProfileFeed isMine = {this.state.isMine} profileId={this.state.profileId} profileAddr={this.state.profileAddr}/>
            </div>  
        }
      
        return(Render);
    };

    componentWillUnmount() {



    };

}

export default withRouter(Profile);