import React from 'react';
import { withRouter } from 'react-router-dom';
const Web3 = require('web3');

class AccountRouter extends React.Component{

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
        this.props.history.push(link)
    };

    addrChange (e) {

        this.setState({
            routeAddr: e.target.value
  
        });

    }

    routeHandle () {
        console.log(this.state.routeAddr)
        let addr = this.state.routeAddr;

        if(addr && Web3.utils.isAddress(addr)) {
            MixUtil.getProfileLocalDb(addr, true)
            .then(profile => {
                if (profile && profile.profileItemId) {
                    this.route('/profile/'+addr);
                } else {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: '',
                        message: addr + " has not created a profile.",
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


                }

            })
            .catch(e => {
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: '',
                    message: addr + " has not created a profile.",
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


            })
        } else {
            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: "Not a valid address format.",
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

        }

    };

    render() {
        let Render;

        Render = 
      
            <div style = {{paddingBottom:'30px'}} >
                <div className="w3-card w3-round w3-white">
                <div className="w3-center w3-container w3-padding">


                    <div style={{paddingBottom: "20px"}}>
                    <h3 style={{paddingBottom: "20px"}} >View a profile by their Mix Address</h3>
            
                    <div  style={{paddingBottom: "20px"}}>
                        
                        <div style={{paddingBottom: "20px"}} className="form-group loginText">
                            <input style={{  width: '100%'}} onChange={this.addrChange.bind(this)} className="form-control" id="routeAddr" placeholder="0x32b3a..." type="text"/>
                        </div>
                        <button onClick= {this.routeHandle.bind(this)} style={{width:"35%"}}  id="create" type="button" className="w3-button btn-lg btn-info">Route</button>
                        
                    </div>
                    </div>
                </div>
            </div>
            </div>
                    
     

        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(AccountRouter);