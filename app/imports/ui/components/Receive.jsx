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
        .then((res)=>{
            Session.set('balance',parseFloat(res).toFixed(4));
            this.setState({
                balance: parseFloat(res).toFixed(4)
            });
        })

        MixUtil.donationBalance(Session.get('addr'))
        .then(_donations => {
            this.setState({
                donations:  parseFloat(_donations).toFixed(2)
            })
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

    withdraw() {
        if(this.state.donations <=0 ){

            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'You currently have no donations to withdraw.',
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

            let notify = $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'Withdrawing your balance.',
                target: '_blank'
            },{
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                type:'info',
                placement: {
                    from: "bottom",
                    align: "center"
                }
            });

            MixUtil.withdrawDonationBalance(Session.get('addr'), notify);
            
        }


    };

    render() {
        let Render;

        Render = 

        <div className="w3-col m6 w3-row-padding">
                <div className="w3-card w3-round w3-white">
                    <div className="w3-container w3-padding">
                        <h2>Receive</h2>
                        <div style={{paddingLeft:"50px"}}>
                                
                                <h5 style = {{paddingTop:"30px"}}>
                                    MIX Balance: {this.state.balance} <br/>
                                    Donation Balance: <a onClick = {this.withdraw.bind(this)} >{this.state.donations}   WITHDRAW</a>
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