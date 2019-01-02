import React from 'react';
import { withRouter } from 'react-router-dom';

import ProfileFeedItem from '../components/ProfileFeedItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../components/Loading';

class Feed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            feedAddr: this.props.match.params.address,
            loaded:false,
            itemsPerSection:10,
            itemCount:0,
            totalItems:0,
            done: false,
            itemArray:[]
         };
    }

    componentWillMount(){

        MixUtil.cultivateMyFeed(this.state.feedAddr)
        .then(_itemArray => {
            console.log(_itemArray);
            this.setState({
                itemArray:_itemArray,
                totalItems:_itemArray.length,
                loaded:true,
                itemCount:(_itemArray.length < 10 ? _itemArray.length : 10)

            })
        })

    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    feedItems() {
        let _feedItems = []
        
        if(this.state.loaded) {
            console.log(this.state.itemArray.length)
            for(let i = 0; i < this.state.itemCount; i++) {
                try { 
                    const mixItem = this.state.itemArray[i]
                    console.log(i);
                    console.log(this.state.itemArray)
                    _feedItems.push(<ProfileFeedItem key = {i} item = {mixItem}/>)
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



    render() {
        let Render;

        if(this.state.loaded) {
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

        } else {
            Render = 
            <Loading></Loading>
        }
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(Feed);