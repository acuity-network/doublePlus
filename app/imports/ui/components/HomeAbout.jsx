import React from 'react';
import { withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

class HomeAbout extends React.Component{

    constructor(props){
        super(props);
        this.state = { fontStyle: {fontSize:"17px", marginRight:"auto",marginLeft:"auto", justifyContent: 'left'}};
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
        <div style={{paddingTop:"30px"}}>
            <div className="w3-card w3-round w3-white">
                <div className="w3-container w3-padding-large">
                <h2 style={{paddingBottom:"15px"}} className="w3-center">About DoublePlus</h2>
                    <span style={this.state.fontStyle}>
                        <p>&nbsp; &nbsp; &nbsp;DoublePlus is a fully decentralized social network platform that enables users to connect directly with each other
                            without an intermediary in the way. This enables full freedom to communicate, share ideas and opinions in a way that isn't
                            possible with the current social networks. In comparison to other new and existing platforms, DoublePlus puts a large emphasis on 
                            decentralization, with no single fail point at any level.
                        </p>
                    </span>

                    <h3 style={{paddingBottom:"15px"}} className="w3-center">--Features--</h3>
                        
                        <span className="w3-center" style={this.state.fontStyle}>

                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> Post are cryptographically signed - </span>100% certainty the user in possession of the private key posted the message. </p>
                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> Permissionless - </span> No user is barred from creating an account and posting. </p>
                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> Accessible across all boarders - </span> DoublePlus application is hosted through a peer to peer network (IPFS). </p>
                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> Censorship resistant post - </span>Post are pinned to the IPFS network and indexed on the MIX blockchain. Both of which are peer to peer decentralized networks. Meaning you are free to post your thoughts and opinions without the possibility of them being removed. </p>
                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> 100% open source - </span>All code is open source and accessible to anyone. Anyone is allowed to audit, review, and alter the code. </p>
                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> No unwanted data collection - </span> Because DoublePlus is completely open source there is no background data collection mechanism. </p>
                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> No account can be demonetized  - </span> Donations go directly to the post owners account and 100% of the funds can be withdrawn immediately. </p>
                            <p> &nbsp; &nbsp;<span style={{fontWeight:"bold"}}> No corporate owners  - </span> DoublePlus is a community driven project, which means no political ties and no hidden agendas. </p>
                            
                        </span>

                    <h3 style={{paddingBottom:"15px"}} className="w3-center">--Getting Started--</h3>

                        <span style={this.state.fontStyle}>
                            <p>
                            &nbsp; &nbsp; &nbsp;In order to get started you will need a MIX account and some MIX token. MIX tokens can be purchased from various exchanges.
                                If you'd like to try DoublePlus you can use the <Link style={{color:"blue"}}to="/faucet">MIX faucet</Link> in order to receive a small amount of MIX for free.  Also, you could
                                reach out to the <a style={{color:"blue"}} target="_blank" href="https://discord.gg/vd7dknY">MIX discord channel</a> and request some MIX. 
                            </p>
                            <p>
                            &nbsp; &nbsp; &nbsp; After your MIX account is funded you will be able to create a profile, create post, follow users, donate to post, and interact with users
                                in a fully decentralized way. <u>Keep in mind DoublePlus is still in active development and many features are still to come.</u>  Report any bugs or feedback to the DoublePlus channel on the <a style={{color:"blue"}} target="_blank" href="https://discord.gg/vd7dknY">MIX blockchain discord.</a>
                            </p>
                            <p>
                                Check out my profile <Link style={{color:"blue"}} to="/profile/0xdbe58fffed107ad854a65c4eff1ea327ee0cbc5c">Here.</Link>
                            </p>

                        </span>
                    
                </div>
            </div>
        </div>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(HomeAbout);