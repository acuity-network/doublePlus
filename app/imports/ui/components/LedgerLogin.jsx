import React from 'react';
import { withRouter } from 'react-router-dom';

class LedgerLogin extends React.Component{

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


    handleSubmit(e) {

        LedgerUtil.ledgerConnect().then(res => {
            console.log(res);
        })
  
    };

    render() {
        let Render;

        Render = 
        <div style ={{margin:'auto', maxWidth:'1200px'}}>
            <div className="w3-col m12" style={{paddingTop:'50px'}}>
                <div className="w3-card w3-round w3-white">
                    <div className="w3-container w3-padding">
                        <div style={{paddingBottom:'10px' }}>
                                <h3 style={{paddingBottom:'20px' }} >Login using Ledger HW Wallet</h3>

                        </div>
                        <div style={{paddingBottom:'20px' }}>
                            <button onClick={this.handleSubmit.bind(this)} type="button" className="btn btn-light"><i className=""></i> &nbsp;Connect to Ledger</button> &nbsp; &nbsp;
                            
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        return(Render);
    };


}

export default withRouter(LedgerLogin);