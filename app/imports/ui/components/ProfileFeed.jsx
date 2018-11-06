import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfilePost from './ProfilePost.jsx';

class ProfileFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = { profileAddr:
                        this.props.profileAddr,
                        isMine: Session.get('addr')==this.props.profileAddr
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
        <div className="w3-col m7">
            <div className="w3-row-padding">
                <div className="w3-col m12">
                    <ProfilePost profileAddr = {this.state.profileAddr} isMine = {this.state.isMine}/>

                
                </div>
            </div>
        </div>      
      

        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileFeed);