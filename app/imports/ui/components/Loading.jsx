import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js';

class Loading extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            gif: "data:image/gif;base64, "+ base64img.base64Gif
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

    render() {
        let Render;
        Render = 
        <div className="w3-card w3-round w3-white">
            <div className="w3-center w3-container w3-padding">
                <img src={this.state.gif} />
                <h1>Loading</h1>
            </div>
        </div>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(Loading);