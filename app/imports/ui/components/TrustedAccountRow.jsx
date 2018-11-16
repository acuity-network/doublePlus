import React from 'react';
import { withRouter } from 'react-router-dom';

class TrustedAccountRow extends React.Component{

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

    render() {
        let Render;
        Render =
        <tr className="table-default">
            {/* <th scope="row">{this.props.addr}</th> */}
            <td><a onClick = { this.route.bind(this,'/profile/' + this.props.addr) } >{this.props.addr}</a></td>
            <td>{this.props.numTrusting}</td>
            {/* <td>Column content</td> */}
        </tr>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(TrustedAccountRow);