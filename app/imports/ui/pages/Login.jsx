import React from 'react';
import { withRouter } from 'react-router-dom';
import PrivKeyLogin from '../components/PrivKeyLogin.jsx'
import LedgerLogin from '../components/LedgerLogin.jsx'

class Login extends React.Component{

    constructor(props){
        super(props);

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


    render() {
        let Render;

        Render = 
        <div>
    
                <PrivKeyLogin/>
          
           
                <LedgerLogin/>
       
        </div>

        return(Render);
    };


}

export default withRouter(Login);