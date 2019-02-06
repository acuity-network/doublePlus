import React from 'react';
import { withRouter } from 'react-router-dom';

class EditProfile extends React.Component{

    constructor(props){
        super(props);
        this.state = { privateKey: ''};
    }

    componentWillMount(){
        this.setState({
  
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link);
    };

    handleLoginChange(e) {
        this.setState({
            privateKey: e.target.value
        });
    };


    handleSubmit(e) {
           
    };

    render() {
        let Render;

        Render = 
        <div className="w3-col m12">
            <div className="w3-card w3-round w3-white">
                <div className="w3-container w3-padding">
                    <div style={{paddingBottom:'20px' }}>
                            <h3 style={{paddingBottom:'20px' }} >Profile Name</h3>
                            <div className="form-group loginText">
                                <input style={{ width: '100%'}} value = {this.state.privateKey} onChange={this.handleLoginChange.bind(this)} className="form-control" id="privKey" placeholder="8329412..." type="text"/>
                            </div>
                    </div>
                    <div style={{paddingBottom:'20px' }}>
                            <h3 style={{paddingBottom:'20px' }} >Bio</h3>
                            <div className="form-group loginText">
                                <input style={{ width: '100%'}} value = {this.state.privateKey} onChange={this.handleLoginChange.bind(this)} className="form-control" id="privKey" placeholder="8329412..." type="text"/>
                            </div>
                    </div>
                    <div style={{paddingBottom:'20px' }}>
                            <h3 style={{paddingBottom:'20px' }} >Location</h3>
                            <div className="form-group loginText">
                                <input style={{ width: '100%'}} value = {this.state.privateKey} onChange={this.handleLoginChange.bind(this)} className="form-control" id="privKey" placeholder="8329412..." type="text"/>
                            </div>
                    </div>
                    <div style={{paddingBottom:'20px' }}>
                        <button onClick={this.handleSubmit.bind(this)} type="button" className="w3-button w3-theme"><i className=""></i> &nbsp;Save Profile</button> &nbsp; &nbsp;
                    </div>
                    
                </div>
            </div>
        </div>
        return(Render);
    };


}

export default withRouter(EditProfile);