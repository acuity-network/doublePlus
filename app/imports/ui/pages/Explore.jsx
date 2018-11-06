import React from 'react';
import { withRouter } from 'react-router-dom';
import MixItems from '../../startup/client/classes/MixItem.js'
import MixItem from '../../startup/client/classes/MixItem.js';

class Explore extends React.Component{

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

    handleItemIdChange (e) {
        this.setState({
            itemId:e.target.value
        })
    };

    handleSubmit () {
        // MixUtil.getItembyId(this.state.itemId).then((res)=>{
        //     console.log(res);
        //     this.setState({
        //         jsonItem:JSON.stringify(res),
        //     });
        // });
        let item = new MixItem(this.state.itemId);
        item.init()
        .then((_item) => {
            item = _item;
            this.setState({
                jsonItem: JSON.stringify(item)
            })
        })

    };

    render() {
        let Render;

        Render =
        <div className="w3-col m12">
                <div className="w3-card w3-round w3-white">
                    <div className="w3-container w3-padding">
                        <div style={{paddingBottom: "20px"}}>
                                <h2 style={{paddingBottom: "20px"}} >Explore MIX</h2>
                                <div className="form-group">
                                        <label htmlFor="addr">Enter a MIX Item ID:</label>
                                    <input onChange={this.handleItemIdChange.bind(this)} style={{width:"80%"}} className="form-control" id="addr" placeholder="0x43b32a..." type="text"/>
                                </div>
                                    <button onClick={this.handleSubmit.bind(this)} type="button" id="save" className="w3-button w3-theme">Find</button>
                        </div>
                        {this.state.jsonItem}
                    </div>
                </div>
            </div>


        return(Render);
    };

}

export default withRouter(Explore);