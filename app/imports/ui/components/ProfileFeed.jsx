import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfilePost from './ProfilePost.jsx';
import ProfileFeedItem from './ProfileFeedItem.jsx';
import MixItem from '../../startup/client/classes/MixItem.js'

class ProfileFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
                        profileAddr:
                            this.props.profileAddr,
                        isMine: 
                            Session.get('addr')==this.props.profileAddr,
                        profileItem:
                            this.props.profileItem,
                        sections:
                            1,
                        itemsPerSection:
                            10,
                        profileChildren:
                            this.props.profileItem.childIds()
                    };
    }

    componentWillMount(){
        
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    profileItems () {
        let profileItems = [];
        console.log(this.state.profileChildren)
        for (let i = this.state.profileChildren.length - 1; i>0; i--) {
            const mixItem = new MixItem(this.state.profileChildren[i]);
            profileItems.push(<ProfileFeedItem key = {i} item = {mixItem}/>)
            console.log(this.state.profileChildren[i])
        }

        return profileItems;

    };

    render() {
        





        let Render;
        Render = 
        <div className="w3-col m7">
            <div className="w3-row-padding">
                <div className="w3-col m12">
                    {this.state.isMine ? <ProfilePost profileAddr = {this.state.profileAddr} isMine = {this.state.isMine}/>:''}
                    {this.profileItems()}
                </div>
            </div>
        </div>      
      

        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileFeed);