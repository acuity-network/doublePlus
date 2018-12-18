import React from 'react';
import { withRouter } from 'react-router-dom';

class ReplyBox extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            parentItem:this.props.parentItem,
            charCount:0
        };
    }

    componentWillMount(){
        this.setState({
  
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    handleReplyChange(e) {
        let _postText = e.target.value;
        let _charCount = e.target.value.length;
        console.log(_charCount);
        this.setState({
            postText: _postText,
            charCount : _charCount
        });

    };

    handleReplySubmit(e) {


    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;
        
        Render =
        <div style={{paddingTop:"10px"}}>
            <div className="form-group loginText">
                <textarea style={{ width: '100%'}}  onChange={this.handleReplyChange.bind(this)} className="form-control" id="reply" placeholder="Reply to post..." type="text"/>
            </div>
            <div style={{paddingBottom:"30px"}}>
                <button  onClick = {this.handleReplySubmit.bind(this)} style={{float: 'right'}} type="button" className="btn btn-info"><i className="fa fa-pencil"></i> &nbsp;Reply</button>
                <span className="w3-right w3-opacity" style={{float: 'right'}}> {140 - this.state.charCount} &nbsp;&nbsp; </span>
            </div>
        </div> 
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ReplyBox);