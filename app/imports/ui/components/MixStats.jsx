import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js'

class MixStats extends React.Component{

    constructor(props){
        super(props);
        this.state = { };
    }

    componentWillMount(){
        this.autoRun = Tracker.autorun(()=>{
            this.setState({
                peers:Session.get('peers'),
                blockNum:Session.get('blockNum'),
                nodeURL:LocalStore.get('nodeURL'),
                connected:(Session.get('blockNum')>=1)?true:false,
                hashRate:Session.get('hashRate'),
                gasPrice:Session.get('gasPrice'),
                redImg: "data:image/png;base64, " + base64img.redImg,
                greenImg: "data:image/png;base64, " + base64img.greenImg,
            });
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    componentWillUnmount() {
        this.autoRun.stop();
    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;
        Render = 
        <div style = {{paddingLeft:'20px'}} className="w3-col m3">
            <div className="w3-card w3-round w3-white">
                <div className="w3-center w3-container w3-padding">
                <h4>Mix Status</h4>
                <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        Connected:
                        {(this.state.connected)?
                        <img width="25" height="25" src={this.state.greenImg}></img>:
                        <img  width="25" height="25" src={this.state.redImg}></img>
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        Node:
                        <span style={{fontSize:'14px'}}>{this.state.nodeURL}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        Block #:
                        <span >{this.state.blockNum}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        Peers:
                        <span >{this.state.peers}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        GasPrice:
                        <span >{this.state.gasPrice}</span>
                    </li>
                </ul>
                </div>
            </div>
        </div>
        return(Render);
    };

}

export default withRouter(MixStats);