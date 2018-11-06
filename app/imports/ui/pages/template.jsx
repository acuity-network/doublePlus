import React from 'react';
import { withRouter } from 'react-router-dom';

class template extends React.Component{

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

    render() {
        let Render;
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(template);