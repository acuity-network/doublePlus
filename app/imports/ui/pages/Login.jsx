import React from 'react';
import { withRouter } from 'react-router-dom';

class Login extends React.Component{

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
        console.log('here');
        this.setState({
            privateKey: e.target.value
        });
    };

    create() {
        this.route('/create');
    };

    handleSubmit(e) {
            SessionUtil.logIn(this.state.privateKey)
            .then((success)=> {
                    Web3Util.getBalance(Session.get('addr'))
                    .then((res) =>{
                        Session.set('balance',parseFloat(res).toFixed(4));
                    })
                    this.route('/');

                    //login message
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: '',
                    message: 'Logged in to account - '+ Session.get('addr'),
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
            })
            .catch((e)=>{

                    //login message
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: '',
                    message: 'Invalid Private Key!',
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

            });
        };

    render() {
        let Render;

        Render = 
        <div style ={{margin:'auto', maxWidth:'1200px'}}>
            <div className="w3-col m12">
                <div className="w3-card w3-round w3-white">
                    <div className="w3-container w3-padding">
                        <div style={{paddingBottom:'20px' }}>
                                <h3 style={{paddingBottom:'20px' }} >Login with Mix Private Key</h3>
                                <div className="form-group loginText">
                                    <input style={{ width: '100%'}} value = {this.state.privateKey} onChange={this.handleLoginChange.bind(this)} className="form-control" id="privKey" placeholder="8329412..." type="text"/>
                                </div>
                        </div>
                        <div style={{paddingBottom:'20px' }}>
                            <button onClick={this.handleSubmit.bind(this)} type="button" className="btn btn-light"><i className=""></i> &nbsp;Login</button> &nbsp; &nbsp;
                            <a href ="#" onClick = {this.create.bind(this)} className="">Create Account</a>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        return(Render);
    };


}

export default withRouter(Login);