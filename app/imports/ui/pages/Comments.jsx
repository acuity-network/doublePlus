import React from 'react';
import { withRouter } from 'react-router-dom';
import CommentReplies from '../components/CommentReplies';

class Comments extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            itemId: this.props.match.params.itemid,
         };
    }

    componentWillMount(){
        this.initializeState(this.props.match.params.itemid)
    };

    componentWillReceiveProps(nextProps){
        this.initializeState(nextProps.match.params.itemid)
    };

    initializeState(_itemId) {
        this.setState({
            itemId: _itemId
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
        <CommentReplies itemId = {this.state.itemId}/>
        return(Render);
    };

    componentWillUnmount() {
     
    };

}

export default withRouter(Comments);