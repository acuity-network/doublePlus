import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfilePost from './ProfilePost.jsx';
import ProfileFeedItem from './ProfileFeedItem.jsx';
import MixItem from '../../startup/client/classes/MixItem.js'
import InfiniteScroll from 'react-infinite-scroll-component';

class ProfileFeed extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
                        profileAddr:
                            this.props.profileAddr,
                        isMine: 
                            Session.get('addr')==this.props.profileAddr,
                        profileObject:
                            this.props.profileObject,
                        itemsPerSection:
                            10,
                        profilePost:
                            this.props.profileObject.post.reverse(),
                        itemCount:
                            this.props.profileObject.post.length < 10 ? this.props.profileObject.post.length: 10,
                        totalItems:
                            this.props.profileObject.post.length, 
                        done:
                            false
                    };
    }

    componentWillMount(){

        
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    profileItems () {
        let _profileItems = [];
    
            for(let i = 0; i < this.state.itemCount; i++) {
                try { 
                const mixItem = new MixItem(this.state.profilePost[i]);
                 _profileItems.push(<ProfileFeedItem key = {i}  item = {mixItem} blurbType = {0}/>)
                } catch(e) {
                    console.log(e)
                }

            }

        return _profileItems;

    };

    loadMore () {
        this.setState({
            itemCount: (this.state.itemCount + this.state.itemsPerSection > this.state.totalItems ? this.state.totalItems : (this.state.itemCount + this.state.itemsPerSection))
        })

    };
    
    
    render() {
        

        let Render;
        Render = 
        <div style ={{margin:'auto', maxWidth:'1200px'}}>
            <div  className="w3-col m8">
                <div className="w3-row-padding">
                    <div className="w3-col m12">
                        {this.state.isMine ? <ProfilePost profileAddr = {this.state.profileAddr} isMine = {this.state.isMine}/>:''}
                        <InfiniteScroll
                            dataLength={this.state.itemCount}
                            next={this.loadMore.bind(this)}
                            hasMore={!this.state.done}
                            loader={null}
                        >
                            {this.profileItems()}
                        </InfiniteScroll> 
                    </div>
                </div>
            </div>     
        </div>
        
      

        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileFeed);