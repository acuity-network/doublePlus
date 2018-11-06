import React from 'react';
import { withRouter } from 'react-router-dom';
const Web3 = require('web3');

class Send extends React.Component{

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
        this.props.history.push(link);
    };

    handleAmountChange(e) {
        this.setState({
            amount:e.target.value
        });
    }

    handleToAddrChange(e) {
        this.setState({
            toAddr:e.target.value
        });
    }

    send () {
        if(this.state.amount == null || !(Number(this.state.amount)>0)) {
            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'Please enter a valid amount.',
                target: '_blank'
            },{
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                type:'danger',
                placement: {
                    from: "bottom",
                    align: "center"
                }
            });
            return;
        } else if (!Web3.utils.isAddress(this.state.toAddr)) {
            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'Please enter a valid address.',
                target: '_blank'
            },{
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                type:'danger',
                placement: {
                    from: "bottom",
                    align: "center"
                }
            });
        } else {
            let res = Web3Util.sendTo(Session.get('addr'),this.state.toAddr,this.state.amount,Session.get('priv'));

        }
    };

    render() {
        let Render;

        Render =

        <div className="w3-col m6 w3-row-padding">
                        <div style={{height:"100%"}} className="w3-card w3-round w3-white">
                            <div className="w3-container w3-padding">
                                <h2>Send</h2>
                                <div style={{paddingTop:"30px"}} className="form-group">
                                        <label htmlFor="toAddr">Send To: </label>
                                        <input onChange={this.handleToAddrChange.bind(this)} className="form-control" id="toAddr" placeholder="0x4e221b..." type="text"/>
                                    </div>
                        
                                    <div className="form-group">
                                        <label htmlFor="amount">Amount:</label>
                                        <input onChange={this.handleAmountChange.bind(this)} className="form-control" id="amount" placeholder="" type="text"/>
                        
                                    </div>
                                    <div style = {{paddingTop:"30px", display: "flex", justifyContent: "center", paddingBottom: "83px"}}>
                                        <button onClick={this.send.bind(this)} style={{width:"50%"}} type="button" id="sendBtn" className="w3-button w3-theme btn-lg">Send</button>
                                    </div>
        
                            </div>
                        </div>
                    </div>



        return(Render);
    };

}

export default withRouter(Send);