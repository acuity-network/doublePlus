import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js'

class ProfileFeedItem extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            item: this.props.item,
            ownerProfile: this.props.profile
        };
    }

    componentWillMount(){
        this.setState({
            profileImg: "data:image/jpeg;base64, " + base64img.defaultProfileImg
        });
        this.state.item.init()
        .then(_item => {
            this.setState({
                owner:_item.owner()
            })
            _item.latestRevision().load()
            .then(_revision => {
                this.setState({
                    bodyText: _revision.getBodyText()
                });


            })

        })
        
        
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
        <div className="w3-container w3-card w3-white w3-round w3-margin"><br/>
            <img  src = {this.state.profileImg} alt="Avatar" className="w3-left w3-circle w3-margin-right" style={{width:'60px'}}/>
            <span className="w3-right w3-opacity">16 min</span>
            <h5>{this.state.owner}</h5><br/>
            <hr className="w3-clear"/>
            <p style={{fontSize:"24px"}}>{this.state.bodyText}</p>
            <button type="button" className="w3-button w3-theme-d1 w3-margin-bottom"><i className="fa fa-thumbs-up"></i> &nbsp;Like</button> 
            <button type="button" className="w3-button w3-theme-d2 w3-margin-bottom"><i className="fa fa-comment"></i> &nbsp;Reply</button> 
        </div>  
        
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileFeedItem);