
import React from 'react';
import { withRouter } from 'react-router-dom';

class NavBar extends React.Component{

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

    route (link, toggle=false) {
        this.props.history.push(link)
        if(toggle) {
            this.toggleHandle();

        }
    };

    toggleHandle () {
        $('#sidebar').toggleClass('active');
    };

    render() {
        let Render;

        Render = 
        <nav  className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">

            <button onClick={this.toggleHandle.bind(this)} type="button" id="sidebarCollapse" className="btn btn-info">
                <i className="fa fa-navicon"></i>
            </button>
            <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i className="fa fa-navicon"></i>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" onClick={this.route.bind(this,'/',false)} >Home</a>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link" href="#">About</a>
                    </li> */}
                    
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://graviex.net/markets/mixbtc">Get MIX</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://mix-blockchain.org/">What's MIX?</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://discord.gg/vd7dknY">Discord</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://github.com/mix-blockchain/doublePlus/">GitHub</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(NavBar);


