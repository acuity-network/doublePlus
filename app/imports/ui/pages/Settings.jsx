import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfileUserEdit from '../components/ProfileUserEdit.jsx'

class Settings extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            nodeURL : LocalStore.get('nodeURL'),
            ipfsApiURL : LocalStore.get('ipfsApiURL'),
            ipfsGatewayURL : LocalStore.get('ipfsGatewayURL'),
            browserIpfs : LocalStore.get('browserIpfs')
            //protocol : LocalStore.get('protocol')
            // ipfsSelect : LocalStore.get('ipfsApiURL') == 'localhost'?'selected':''
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

    handleNodeChange (e) {
        this.setState({
            nodeURL: e.target.value
        })
    };

    handleApiChange (e) {
        this.setState({
            ipfsApiURL: e.target.value
        })
    };

    handleGatewayChange (e) {
        this.setState({
            ipfsGatewayURL: e.target.value
        })
    };

    save () {
        LocalStore.set('nodeURL', this.state.nodeURL);
        LocalStore.set('ipfsApiURL', this.state.ipfsApiURL);
        LocalStore.set('ipfsGatewayURL', this.state.ipfsGatewayURL);
        let protocol = LocalStore.get('ipfsApiURL') == 'localhost'?'http':'https';
        LocalStore.set('protocol', protocol);
        LocalStore.set('browserIpfs', this.state.browserIpfs);
        Web3Util.initWeb3();
        IpfsUtil.initIPFS();
        this.route('/');
        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            title: '',
            message: 'Settings updated!',
            target: '_blank'
        },{
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            type:'success',
            placement: {
                from: "bottom",
                align: "center"
            }
        });
    }

    restore () {
        LocalStore.set('nodeURL', "https://rpc.doubleplus.io/");
        LocalStore.set('ipfsApiURL', 'localhost');
        LocalStore.set('protocol', 'http')
        LocalStore.set('ipfsGatewayURL', 'https://ipfs.infura.io/');
        LocalStore.set('browserIpfs', true);
        Web3Util.initWeb3();
        IpfsUtil.initIPFS();
        this.route('/');
        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            title: '',
            message: 'Defaults Restored!',
            target: '_blank'
        },{
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            type:'success',
            placement: {
                from: "bottom",
                align: "center"
            }
        });
    }

    handleCheck (e) {
        if(e.target.checked) {
            this.setState({
                browserIpfs: true
            })
        } else {
            this.setState({
                browserIpfs: false
            })
        }
    }
    render() {
        let Render;

        Render = 
    


        <div style ={{margin:'auto', maxWidth:'1200px'}}>
        <div style={{paddingBottom: "20px"}} className="w3-col m12 w3-row-padding">
                <div className="w3-card w3-round w3-white">
                    <div className="w3-container w3-padding">
                        <div style={{paddingBottom: "20px"}}>
                                <h2 style={{paddingBottom: "20px"}} >Double Plus Settings</h2>
                                <div className="form-group">
                                        <label htmlFor="nodeURL">Node URL:</label>
                                    <input onChange= {this.handleNodeChange.bind(this)} style={{width:"100%"}} className="form-control" id="nodeURL" value={this.state.nodeURL} type="text"/>
                                </div>
                                {/* <div className="form-group">
                                        <label htmlFor="ipfsApiURL">IPFS API URL:</label>
                                    <input onChange= {this.handleApiChange.bind(this)} style={{width:"100%"}} className="form-control" id="ipfsApiURL" value={this.state.ipfsApiURL} type="text"/>
                                </div> */}

                                <div className="form-group">
                
                                    <input  onChange={this.handleCheck.bind(this)} type="checkbox" id = "ipfsCheckBox" checked={this.state.browserIpfs}></input>
                                    <label htmlFor = "ipfsCheckBox">Use Browser IPFS?</label>
                                    <br/>
                                    <label htmlFor="ipfsApiURL">IPFS API Host: </label> <br/>
                                    <select disabled={this.state.browserIpfs} defaultValue = {this.state.ipfsApiURL} style={{width:'40%'}} onChange = {this.handleApiChange.bind(this)} className="form-control" id="ipfsApiURL">
                                        {/* <option  value='ipfs.infura.io'>ipfs.infura.io</option> */}
                                        <option  value='localhost'>localhost</option>
                                        
                                    </select>
                                </div>
                     

                                {/* <div className="form-group">
                                    <label htmlFor="ipfsGatewayURL">IPFS Gateway URL:</label>
                                <input onChange={this.handleGatewayChange.bind(this)} style={{width:"100%"}} className="form-control" id="ipfsGatewayURL" value={this.state.ipfsGatewayURL} type="text"/>
                            </div> */}
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <button onClick={this.save.bind(this)} id="save" type="button" className="btn btn-success"><i ></i> &nbsp;Save</button> &nbsp;
                            <button onClick={this.restore.bind(this)} id="restore" type="button" className="btn w3-theme"><i></i> &nbsp;Restore Defaults</button> &nbsp;
                        </div>
                        
                    </div>
                </div>
                </div>

                {/* {Session.get('loggedIn')?<ProfileUserEdit/>:''} */}
                </div>
            
       



        return(Render);
    };

}

export default withRouter(Settings);