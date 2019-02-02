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

        this.setState({
            itemId: this.props.match.params.itemid
        });
      };

      componentWillReceiveProps(nextProps){

        // console.log(nextProps.match.params.itemid, this.props.match.params.itemid)
        // if(nextProps.match.params.itemid !== this.props.match.params.itemid) {
            this.setState({
                itemId: nextProps.match.params.itemid
            });
        //     console.log(this.state.itemId);
        // };

      }

    //  componentDidUpdate(prevProps, prevState) {
    //      console.log(prevProps.match.params.itemid, this.props.match.params.itemid)
    //     if(prevProps.match.params.itemid !== this.props.match.params.itemid) {
    //         this.setState({
    //             itemId: this.props.match.params.itemid
    //         });
    //         console.log(this.state.itemId);
    //     };
    //  }

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