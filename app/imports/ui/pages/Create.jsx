import React from 'react';
import { withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

class Create extends React.Component{

    constructor(props){
        super(props);
        this.state = { };
    }

    componentWillMount(){

        if(Session.get("loggedIn")) {this.route('/')}

        this.setState({
  
        });
    };

    route (link) {
        this.props.history.push(link)
    };

    loginHandle () {
        this.route('/login');
    };

    createHandle () {
        let wallet = EthWallet.generate();

            SessionUtil.logIn(wallet.getPrivateKeyString().replace('0x',''));
            //notify start
            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'Account Created - ' + wallet.getAddressString(),
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
            this.setState({
                priv:Session.get('priv'),
                addr:Session.get('addr')
            });
            //notify end
            $('#createdModal').show();
        
    }

    hideModal () {
        $('#createdModal').hide();
        this.route('/');


    }

    render() {
        let Render;
        

        Render = 
        <div style ={{margin:'auto', maxWidth:'1200px'}}>
        <div className="w3-col m12">
            <div className="w3-card w3-round w3-white">
                <div className="w3-container w3-padding">
                <div style={{paddingBottom: "20px"}}>
                    <h3 style={{paddingBottom: "20px"}} >Create Mix Account</h3>
            
                    <div  style={{paddingBottom: "20px"}}>
                        
                        <button onClick= {this.createHandle.bind(this)} id="create" type="button" className="btn btn-light"><i className=""></i> &nbsp;Create</button>&nbsp;&nbsp;&nbsp;
                        <a onClick = {this.loginHandle.bind(this)} >Login with existing account</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div className="modal" id="createdModal" style = {{paddingTop:'50px'}}>
    <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Account Created!</h5>

            </div>
            <div className="modal-body">
                <p><strong>Save the following information to access your account.</strong></p>
                <p><strong>Public Address: </strong>  {this.state.addr} <br/>  </p>
                <p><strong>Private Key:  </strong> {this.state.priv} <br/>  </p>
                <p><strong><u>You must save your private key in order to access your account in the future.</u></strong></p>
            </div>
            <div className="modal-footer">
                <span style={{float:"left", marginLeft:"auto"}}> Need some MIX to get started?  Use the <Link style={{color:"blue"}} to="/faucet">MIX facuet.</Link></span>
                <button type="button" onClick={this.hideModal.bind(this)} className="btn btn-light" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
</div>;

    
        return(Render);
    };

}

export default withRouter(Create);