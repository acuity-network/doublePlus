import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js'

class IpfsStats extends React.Component{

    constructor(props){
        super(props);
        this.state = { };
    }

    componentWillMount(){
        this.autoRun = Tracker.autorun(()=>{
            this.setState({
                nodeURL:LocalStore.get('ipfsApiURL'),
                connected:Session.get('ipfsConnected'),
                ipfsId:Session.get('ipfsId'),
                redImg: "data:image/png;base64, " + base64img.redImg,
                greenImg: "data:image/png;base64, " + base64img.greenImg
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
        <div style = {{paddingLeft:'20px',paddingTop:'30px'}} className="w3-col m3">
            <div className="w3-card w3-round w3-white">
                <div className="w3-center w3-container w3-padding">
                <h4>IPFS Status</h4>
                <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        Connected:
                        {(this.state.connected)?
                        <img width="25" height="25" src={this.state.greenImg}></img>:
                        <img  width="25" height="25" src={this.state.redImg}></img>
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        API URL:
                        <span >{this.state.nodeURL}</span>
                    </li>
                    
                    {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                        Peers:
                        <span >{this.state.peers}</span>
                    </li> */}
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        Node ID:
                            <span style={{fontSize:'10px'}} >{this.state.ipfsId}</span>
                    </li>
                </ul>
                </div>
            </div>
        </div>
        return(Render);
    };

}

export default withRouter(IpfsStats);