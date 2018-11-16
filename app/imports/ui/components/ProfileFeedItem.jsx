import React from 'react';
import { withRouter } from 'react-router-dom';

class ProfileFeedItem extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            item: this.props.item
        };
    }

    componentWillMount(){
        
        this.state.item.init()
        .then(_item => {
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
            {/* <img src="/w3images/avatar5.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">
            <span class="w3-right w3-opacity">16 min</span>
            <h4>Jane Doe</h4><br> */}
            <hr className="w3-clear"/>
            <p>{this.state.bodyText}</p>
            <button type="button" className="w3-button w3-theme-d1 w3-margin-bottom"><i className="fa fa-thumbs-up"></i> &nbsp;Like</button> 
            <button type="button" className="w3-button w3-theme-d2 w3-margin-bottom"><i className="fa fa-comment"></i> &nbsp;Reply</button> 
        </div>  
        
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileFeedItem);