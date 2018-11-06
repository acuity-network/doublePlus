import React from 'react';
import { withRouter } from 'react-router-dom';

class template extends React.Component{

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

        <div className="modal" id="createdModal">
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Account Created!</h5>

                </div>
                <div className="modal-body">
                    <p><strong>Save the following information to access your account.</strong></p>
                    <p><strong>Public Address: {this.props.addr} </strong> <br/>  </p>
                    <p><strong>Private Key: {this.props.priv} </strong><br/>  </p>
                </div>
                <div className="modal-footer">
                    <button type="button" id="closeBtn" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
        return(Render);
    };

}

export default withRouter(template);


