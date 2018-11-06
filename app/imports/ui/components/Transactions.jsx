import React from 'react';
import { withRouter } from 'react-router-dom';

class Transactions extends React.Component{

    constructor(props){
        super(props);
        this.state ={style: {
                        paddingTop:this.props.paddingTop
                    } 
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

    render() {
        let Render;

        Render = 
        <div style={this.state.style} className="w3-col m12">
            <div className="w3-card w3-round w3-white">
                <div className="w3-container w3-padding">
                   <h2>
                       Transactions
                   </h2>
                    
                </div>
            </div>
        </div>
        return(Render);
    };

}

export default withRouter(Transactions);