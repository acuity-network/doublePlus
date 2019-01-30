import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfileFeedItem from './ProfileFeedItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './Loading';
import MixItem from '../../startup/client/classes/MixItem.js'

class CommentReplies extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            itemId: this.props.itemId,
            loaded:false,
            itemsPerSection:10,
            itemCount:0,
            totalItems:0,
            done: false,
            itemArray:[]
         };
    }

    componentWillMount(){
        this.initalize(this.state.itemId);
    };

    initalize(itemId){
        console.log(this.state.itemId)
        MixUtil.getComments(itemId)
        .then((res)=>{
            console.log(res)
            this.setState({
                itemId:itemId,
                itemArray: res.reverse(),
                totalItems: res.length,
                loaded:true,
                itemCount:(res.length < 10 ? res.length : 10)
            });

        })
    };

    componentWillReceiveProps(nextProps){
        console.log(nextProps.itemId, this.state.itemId)
        // if(nextProps.itemId !== this.state.itemId) {
            this.initalize(nextProps.itemId);
        // };

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
            for(let i = 0; i < this.state.itemCount; i++) {
                try { 
                    const mixItem = new MixItem(this.state.itemArray[i]);
                    _feedItems.push(<ProfileFeedItem key = {i} item = {mixItem} blurbType={1}/>)
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
        console.log(this.state.itemArray)
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

export default withRouter(CommentReplies);