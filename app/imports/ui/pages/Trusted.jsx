import React from 'react';
import { withRouter } from 'react-router-dom';
import { stat } from 'fs';
import TrustedAccountRow from '../components/TrustedAccountRow.jsx';
import Loading from '../components/Loading.jsx';

class Trusted extends React.Component{

    constructor(props){
        super(props);
        this.state = {loaded:false };
    }

    componentWillMount(){
        //let _trusted = MixUtil.getTrustedAccounts(Session.get('addr'));
        MixUtil.getAccountsTrustingData(Session.get('addr'))
        .then((_trustedTableData)=>{
            console.log(_trustedTableData);
            this.setState({
                loaded:true,
                trustedTableData:_trustedTableData
            });
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    handleAddrChange (e) {
        this.setState({
            trustedAddr:e.target.value
        })
    };

    handleSubmit (e) {
        if(Web3Util.isAddress(this.state.trustedAddr)) {
            MixUtil.addTrustedAccount(Session.get('addr'), this.state.trustedAddr, Session.get('priv'));
        } else {
            $.notify({
                icon: 'glyphicon glyphicon-warning-sign',
                title: '',
                message: 'Invalid Address!',
                target: '_blank'
            },{
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                type:'danger',
                placement: {
                    from: "bottom",
                    align: "center"
                }
            });

        }
        
    };

    render() {
        let Render;

        if(this.state.loaded){
        Render = 

            <div className="w3-col m12">
                    <div className="w3-card w3-round w3-white">
                        <div className="w3-container w3-padding">
                            <div style={{paddingBottom: "60px"}}>
                                    <h2 style={{paddingBottom: "20px"}} >My Trusted Accounts</h2>
                                    <div className="form-group">
                                            <label htmlFor="addr">Add Trusted Account</label>
                                        <input onChange={this.handleAddrChange.bind(this)} style={{width:"100%"}} className="form-control" id="addr" placeholder="0x43b32a..." type="text"/>
                                    </div>
                                        <button onClick={this.handleSubmit.bind(this)} type="button" id="save" className="w3-button w3-theme">Add</button>
                            </div>


                        <table className="table table-hover">
                        <thead>
                        <tr className="table-active">
                                <th scope="col">Address</th>
                                <th scope="col"># Accounts Trusting</th>
                                {/* <th scope="col">Remove</th> */}
                            </tr>
                        </thead>
                        <tbody>

                            {this.state.trustedTableData ? this.state.trustedTableData.map(item => <TrustedAccountRow key={item.addr} addr={item.addr} numTrusting={item.numTrusting} />):''}
                        
                        </tbody>
                    </table>
                        </div>
                    </div>
                    
                </div>
            } else {
                Render =
                <Loading />
            }
        
        
        return(Render);
    };

}

export default withRouter(Trusted);