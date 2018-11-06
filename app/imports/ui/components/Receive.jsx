import React from 'react';
import { withRouter } from 'react-router-dom';

class Receive extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            addr: Session.get('addr'),
            balance: Session.get('balance')
        };
    }

    componentWillMount(){
        Web3Util.getBalance(Session.get('addr'))
        .then((bal)=>{
            Session.set('balance',bal);
            this.setState({
                balance: bal
            });
        })
        
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };
    componentDidMount() {
        $("#qrcode").qrcode({
            size: 200,
            text: "mix:" + Session.get("addr")
        });
    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;

        Render = 

        <div className="w3-col m6 w3-row-padding">
                <div className="w3-card w3-round w3-white">
                    <div className="w3-container w3-padding">
                        <h2>Receive</h2>
                        <div>
                                
                                <h5 style = {{paddingTop:"30px", paddingLeft:"50px"}}>
                                    Mix Balance: {this.state.balance} 
                                </h5>
                            <div id="qrcode" style={{paddingTop:"40px", textAlign: "center"}}> </div>
                            <div style={{textAlign: "center"}}> <p>{this.state.addr}</p></div>
                                  
                                
                        </div>

                    </div>
                </div>
            </div>

        return(Render);
    };

}

export default withRouter(Receive);