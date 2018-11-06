import React from 'react';
import { withRouter } from 'react-router-dom';
import Receive from '../components/Receive';
import Send from '../components/Send.jsx';
import Transactions from '../components/Transactions.jsx';


class Wallet extends React.Component{

    constructor(props){
        
        super(props);
        this.state = { };
    }

    componentWillMount(){
        if(!Session.get('loggedIn')){
            this.route('/login');
        } 
        this.setState({
  
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;

        Render = 
            <div className="w3-container w3-content" style={{maxWidth:"1400px", marginTop:"20px"}}> 
                <div className="w3-row">
                    <Send></Send>
                    <Receive> </Receive>
                    {/* <Transactions paddingTop={'30px'}></Transactions> */}
                </div>
            </div>
        return(Render);
    };

}

export default withRouter(Wallet);