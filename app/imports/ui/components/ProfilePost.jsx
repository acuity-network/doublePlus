import React from 'react';
import { withRouter } from 'react-router-dom';

class ProfilePost extends React.Component{

    constructor(props){
        super(props);
        this.state = { };
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
        let _charCount = postText.length;
        console.log(charCount);
        this.setState({
            postText: _postText,
            charCount : _charCount
        });

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
                <button  style={{float: 'right'}} type="button" className="w3-button w3-theme"><i className="fa fa-pencil"></i> &nbsp;Post</button> 
                <button  type="button" className="w3-button w3-theme"><i className="fa fa-image"></i> &nbsp;Attach Img</button> 
            </div>
        </div>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfilePost);