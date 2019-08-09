import React from 'react';
import { withRouter } from 'react-router-dom';

class MixFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            feedAddr: this.props.match.params.itemid,
            loaded:false,
            itemsPerSection:10,
            itemCount:0,
            totalItems:0,
            done: false,
            itemArray:[]
         };
    }

    componentWillMount(){
        console.log('hereee')
        MixUtil.mixFeed(this.state.feedAddr)
        .then(_itemArray => {
            console.log(_itemArray)
            this.setState({
                itemArray:_itemArray,
                totalItems:_itemArray.length,
                loaded:true,
                itemCount:(_itemArray.length < 10 ? _itemArray.length : 10)

            })
        })
    };


    feedItems() {
        let _feedItems = []
        
        if(this.state.loaded) {
            for(let i = 0; i < this.state.itemCount; i++) {
                try { 
                    const mixItem = this.state.itemArray[i]
                    _feedItems.push(<ProfileFeedItem key = {i} item = {mixItem} blurbType={-1}/>)
                } catch(e) {
                    console.log(e)
                }

            }
         }
        return _feedItems;
    };

    loadMore () {
        this.setState({
            itemCount: (this.state.itemCount + this.state.itemsPerSection > this.state.totalItems ? this.state.totalItems : (this.state.itemCount + this.state.itemsPerSection))
        })

    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;
        return(Render);
    };

    componentWillUnmount() {
        let Render;

        if(this.state.loaded && this.state.itemCount>0) {
        Render = 
        <div style ={{margin:'auto', maxWidth:'800px'}}>
            <div  className="w3-col m12">
                <div className="w3-row-padding">
                    <div className="w3-col m12">
                        <InfiniteScroll
                            dataLength={this.state.itemCount}
                            next={this.loadMore.bind(this)}
                            hasMore={!this.state.done}
                            loader={null}
                        >
                            {this.feedItems()}
                        </InfiniteScroll> 
                    </div>
                </div>
            </div>     
        </div>
        }else if(this.state.loaded){
            Render = 
            <div>
                <div style ={{margin:'auto', maxWidth:'800px'}}></div>
                <div  className="w3-col m12">
                    <div className="w3-row-padding">
                        <div className="w3-col m12">
                            <h2>This feed has no post.</h2>
                        </div>
                    </div>
                </div>
            </div>
        } else {
            Render = 
            <Loading></Loading>
        }
        return(Render);
    };

}

export default withRouter(MixFeed);