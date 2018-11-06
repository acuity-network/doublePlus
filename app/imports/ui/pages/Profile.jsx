import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfileUserInfo from '../components/ProfileUserInfo.jsx';
import ProfileFeed from '../components/ProfileFeed';



class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            profileAddr:
            this.props.match.params.address 
        };
        console.log(this.props.match.params.address);
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
        <div className="w3-row">       
          <ProfileUserInfo profileAddr={this.state.profileAddr}/>
          <ProfileFeed profileAddr={this.state.profileAddr}/>
        </div>  
      
        return(Render);
    };

    componentWillUnmount() {



    };

}

export default withRouter(Profile);