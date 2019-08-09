
const Web3 = require('web3');

const itemStoreRegistryAbi = require('../lib/jsonAbis/itemStoreRegistry.abi.json');
const itemStoreRegistryAddr = '0x8928f846012b98aac5cd2f4ef4029097cd4110fc';

const itemStoreShortIdAbi = require('../lib/jsonAbis/itemStoreShortId.abi.json');
const itemStoreShortIdAddr = '0xd02ee768718b41a8cea9350d7c4c443727da5c7b';

const itemStoreAbi = require('../lib/jsonAbis/itemStoreInterface.abi.json');

const itemStoreIpfsSha256Abi = require('../lib/jsonAbis/itemStoreIPFSSha256.abi.json');
const itemStoreIpfsSha256Addr = '0x1c12e8667bd48f87263e0745d7b28ea18f74ac0e';

const accountProfileAbi = require('../lib/jsonAbis/AccountProfile.abi.json');
const accountProfileAddr = '0x7855a6b883c39c8e87d51002b064180ddbf16026';

const trustedAccountsAbi = require('../lib/jsonAbis/trustedAccounts.abi.json');
const trustedAccountAddr = '0x11dc5cf838ae3850458f92474dc28d1e47f8e045';

const itemDagAbi = require('../lib/jsonAbis/ItemDag.abi.json');
const ItemDagOneParentAbi = require('../lib/jsonAbis/ItemDagOneParent.abi.json');

const itemDagAddr = '0xbd3af0bdcf4c8a6dfd8f6ff2129409632decfc7e';

const itemDagOnlyOwnerAddr = '0xd6cc1712b46a599f87f023fad83bc06473bb2b8d';

const itemDagFeedAddr = '0xd6cc1712b46a599f87f023fad83bc06473bb2b8d';


const blurbsAbi = require('../lib/jsonAbis/Blurbs.abi.json');
const blurbsAddr = '0x67e27cd15b4df2e1bc85729e59e6e7964274b9af';

import MixItem from '../classes/MixItem.js'
const MixContent = require('../classes/MixContent.js')
const MixRevision = require('../classes/MixRevision.js')

const multihashes = require('multihashes');
const itemPb = require("./protobuf/item_pb.js");
const mixinmixin = require("./protobuf/mixin-mixin_pb.js");
const jpegmixin = require("./protobuf/jpeg-image_pb.js");
const brotli = require("../lib/brotli/brotli.js");
var bro = new brotli.Brotli();
const Base58 = require("base-58");


module.exports = {

    getItembyId: async (itemId) => {


        try{
          const web3 = global.web3;
          const itemStoreRegistry = new web3.eth.Contract(itemStoreRegistryAbi, itemStoreRegistryAddr);

          let itemStoreAddress = await itemStoreRegistry.methods.getItemStore(itemId).call();
      
          if (itemStoreAddress == "0x") {
            console.log("Item store not found for item.");
          }
      
          let itemStore = new web3.eth.Contract(itemStoreAbi, itemStoreAddress);
      
          let abiVersion = await itemStore.methods.getAbiVersion().call();
          
          let inUse = await itemStore.methods.getInUse(itemId).call();

          if(!inUse) {
            
            return;
          }

          let contractId = await itemStore.methods.getContractId().call();
      
          if (contractId != "0x2d54bddf4be19c6c") {
            console.log("Unknown item store.");
            return;
          }

          const itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, itemStoreAddress);
      
          const item = await itemStoreIpfsSha256.methods.getItem(itemId).call();
      
          const _flags = item[0];
          const _owner = item[1];
          const _revisionCount = item[2].valueOf();
          const _revisionIpfsHashes = item[3];
          const _revisionTimestamps = item[4];
          const _parentIds = item[5];
          const _childIds = item[6];
          for (var i = 0; i < _revisionTimestamps.length; i++) {
            _revisionTimestamps[i] = _revisionTimestamps[i].valueOf();
          }

          let jsonItem = {           
            flags:_flags,
            owner:_owner,
            revisionCount:_revisionCount,
            revisionIpfsHashes:_revisionIpfsHashes,
            revisionTimestamps:_revisionTimestamps,
            parentIds:_parentIds,
            childIds:_childIds

          };
          let file = IpfsUtil.getItemFromHexHash(jsonItem.revisionIpfsHashes[0]);
    
          return jsonItem;

      } catch(e) {
        console.log(e);
      }

    },

    getTrustedAccounts:async (addr) => {
      const web3 = global.web3;
      
      let trustedAccounts = new web3.eth.Contract(trustedAccountsAbi, trustedAccountAddr);
      
      let trusted = await trustedAccounts.methods.getAllTrustedByAccount(addr).call();

      return (trusted);

    },

    isTrusting: async(myAddr, trustingAddr)=>{
      const web3 = global.web3;
      let trusted = [];

      trusted = await module.exports.getTrustedAccounts(myAddr);
      return (trusted.includes(web3.utils.toChecksumAddress(trustingAddr)))
    },
    addTrustedAccount:async (myAddr, trustedAddr)=> {
      try{
        const web3 = global.web3;

        const trustedAccounts = new web3.eth.Contract(trustedAccountsAbi, trustedAccountAddr);
        const addTrusted = trustedAccounts.methods.trustAccount(trustedAddr);
        const encodedABI = addTrusted.encodeABI();
        let gasEst = await addTrusted.estimateGas();

        const notify = $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          title: '',
          message: 'Creating Transaction..',
          target: '_blank',
          allow_dismiss: false,
        },{
          animate: {
              enter: 'animated fadeInDown',
              exit: 'animated fadeOutUp'
          },
          type:'info',
          showProgressbar: false,
          placement: {
              from: "bottom",
              align: "center"
          }
        });

        //let GasPrice = await Web3Util.getGasPrice();
        let GasPrice = Session.get('gasPrice');
        let Nonce = await web3.eth.getTransactionCount(myAddr);
      
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: trustedAccountAddr,
          gas: gasEst,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx, notify);
        return hash;

      } catch(e) {

        throw (e);
      }


    },

    followUser: async(myAddr, trustedAddr)=> {
      if(! await module.exports.isTrusting(myAddr, trustedAddr)) {
        await module.exports.addTrustedAccount(myAddr, trustedAddr);
      } else {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          title: '',
          message: 'Already following User.',
          target: '_blank',
          allow_dismiss: false,
        },{
          animate: {
              enter: 'animated fadeInDown',
              exit: 'animated fadeOutUp'
          },
          type:'danger',
          showProgressbar: false,
          placement: {
              from: "bottom",
              align: "center"
          }
        });

      }
      
    },

    removeTrustedAccount:async(addr)=> {


    },

    numberOfAccountsTrusting:async(addr) => {

      const web3 = global.web3;

      let trustedAccounts = new web3.eth.Contract(trustedAccountsAbi, trustedAccountAddr);     
      let count = await trustedAccounts.methods.getTrustedCountByAccount(addr).call();

      return (count);
    },

    getAccountsTrustingData:async(myAddr) => {
      let returnArray =[];
      const trusted = await module.exports.getTrustedAccounts(myAddr);

      for(const addr of trusted) { 
        const count = await module.exports.numberOfAccountsTrusting(addr);
        
        const jsonObj = await {"addr": addr,
                               "numTrusting":count};

        await returnArray.push(jsonObj)
      }

      return returnArray;

    },


    accountHasProfile: async(addr) => {

      const web3 = global.web3;
      const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
      try {
        return await accountProfile.methods.hasProfile(addr).call();
      } catch (e) {
        console.log(e.message)
        return false;
      }
    },

    associateProfileToAccount: async(myAddr, mixAccountItemId) => {
      const web3 = global.web3;
      
      const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
      
        try {
       
          const setProfile = accountProfile.methods.setProfile(mixAccountItemId);
          const encodedABI = setProfile.encodeABI();

          //let GasPrice = await Web3Util.getGasPrice();
          let GasPrice = Session.get('gasPrice');
          let Nonce = await web3.eth.getTransactionCount(myAddr, 'pending');

          let rawTx = {
            nonce:Nonce,
            chainId:76,
            to: accountProfileAddr,
            from:myAddr,
            gas: 2000000,
            data: encodedABI,
            gasPrice:GasPrice
          }; 

          let hash = await Web3Util.signAndSendRawTx(rawTx);
          return hash;
    
        } catch (e) {
          console.log(e.message);
          throw(e);
        }
      
    },

    getProfile: async(addr) => {
      
      try {
        const web3 = global.web3;
        const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
        let profileId = await accountProfile.methods.getProfileByAccount(addr).call();
        return profileId;

      } catch (e) {
        console.log(e.message);
        return null;
      }
    },


    createOrReviseMyProfile: async(ipfsHash, myAddr, notify = null) => {
      
      try {
        const web3 = global.web3;
        const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
       // accountProfile.getPastEvents("allEvents",(e,events)=>{console.log(events)})
        const myProfile = await module.exports.getProfile(myAddr);
        console.log('my profile',myProfile)
        if(myProfile == null || myProfile == '0x') {
          
          await module.exports.createProfile(ipfsHash, myAddr, notify);

        } else {
          
          await module.exports.updateLatestRevision(myAddr, myProfile, ipfsHash, notify);

        }

      } catch (e) {
        console.log(e.message)
      }
    },

    createProfile: async(ipfsHash, myAddr, notify = null) => {

      try {
        
        const web3 = global.web3;
        let flagsNonce = '0x01' + web3.utils.randomHex(30).substr(2);
        let itemId = await module.exports.getItemId(flagsNonce, myAddr);

        await module.exports.createNewItem(myAddr,ipfsHash,flagsNonce,notify);
        await module.exports.associateProfileToAccount(myAddr, itemId);  

      } catch(e) {
       console.log(e.message)
      }

    },


    getItemId: async(flagsNonce,myAddr) => {
      
      const web3 = global.web3;
      const itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, itemStoreIpfsSha256Addr);
      let itemId = await itemStoreIpfsSha256.methods.getNewItemId(myAddr, flagsNonce).call({from:myAddr});
      return itemId;

    },

    
    createNewItem: async(myAddr, ipfsHash, flagsNonce, notify = false) => {
      
      try {
        const web3 = global.web3;
        
        const itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, itemStoreIpfsSha256Addr);
        let createItem;
        createItem = await itemStoreIpfsSha256.methods.create(flagsNonce,ipfsHash);
        
        const encodedABI = createItem.encodeABI();

        let gasEst = await createItem.estimateGas();

        //let GasPrice = await Web3Util.getGasPrice();
        let GasPrice = Session.get('gasPrice');
        let Nonce = await web3.eth.getTransactionCount(myAddr,'pending');
        console.log('n1', Nonce)
  
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: itemStoreIpfsSha256Addr,
          gas: 2500000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx, notify);
        return hash;

      } catch (e) {
        throw e
      }

    },

    createNewRevision: async(myAddr, mixItemId, revisionIpfsHash, notify=null) => {

      try{
        const web3 = global.web3;
        const itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, itemStoreIpfsSha256Addr);

        let reviseItem = await itemStoreIpfsSha256.methods.createNewRevision(mixItemId, revisionIpfsHash);
        const encodedABI = reviseItem.encodeABI();

        if(notify) {
          notify.update('message', 'Revising Mix Item!');
          // notify.update('progress', 60);
        }

        //let GasPrice = await Web3Util.getGasPrice();
        let GasPrice = Session.get('gasPrice');
        let Nonce = await web3.eth.getTransactionCount(myAddr, "pending");
      
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: itemStoreIpfsSha256Addr,
          gas: 2500000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx, notify);
        return hash;

      } catch (e) {
        throw e
      }
   
    },

    updateLatestRevision: async(myAddr, itemId, revisionIpfsHash, notify=null) => {

      try{
        const web3 = global.web3;
        const itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, itemStoreIpfsSha256Addr);

        let reviseItem = await itemStoreIpfsSha256.methods.updateLatestRevision(itemId, revisionIpfsHash);
        const encodedABI = reviseItem.encodeABI();

        if(notify) {
          notify.update('message', 'Revising Mix Item!');
          // notify.update('progress', 60);
        }

        //let GasPrice = await Web3Util.getGasPrice();
        let GasPrice = Session.get('gasPrice');
        let Nonce = await web3.eth.getTransactionCount(myAddr, "pending");
      
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: itemStoreIpfsSha256Addr,
          gas: 2500000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx, notify);
        return hash;

      } catch (e) {
        throw e
      }

    },

    addChildToParent: async(myAddr, parent, flagsNonce, onlyOwner = false) => {

      try{
        const web3 = global.web3;
        const itemDagContractAddr =  onlyOwner ? itemDagFeedAddr : itemDagAddr;
        const itemDag =  new web3.eth.Contract(itemDagAbi, itemDagContractAddr);
        let reviseItem = await itemDag.methods.addChild(parent, itemStoreIpfsSha256Addr, flagsNonce);
        const encodedABI = reviseItem.encodeABI();

        //let GasPrice = await Web3Util.getGasPrice();
        let GasPrice = Session.get('gasPrice');
        let Nonce = await web3.eth.getTransactionCount(myAddr, 'pending');
        console.log('n2', Nonce)
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: itemDagContractAddr,
          gas: 2500000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx);
        return hash;

      } catch (e) {
        throw e
      }
   
    },

    
    postNewBlurb: async(myAddr, ipfsHash, parentProfileId, notify = null) => {

        try {

          let flagsNonce = '0x01' + Web3.utils.randomHex(30).substr(2);
          let itemId = await module.exports.getItemId(flagsNonce, myAddr);
                  
          await module.exports.addChildToParent(myAddr, parentProfileId, flagsNonce, true);
          await module.exports.createNewItem(myAddr,ipfsHash,flagsNonce, notify);
          await module.exports.initializeBlurb(myAddr, itemId, 0);
          

          } catch (e) {
              throw e
          }
        
    },

    commentToPost: async(myAddr, ipfsHash, parentProfileId, parentPostId, notify = null) => {
      try {

        let flagsNonce = '0x01' + Web3.utils.randomHex(30).substr(2);
        let itemId = await module.exports.getItemId(flagsNonce, myAddr);
        
        await module.exports.addChildToParent(myAddr, parentPostId, flagsNonce, false)
        await module.exports.createNewItem(myAddr,ipfsHash,flagsNonce, notify);
        await module.exports.initializeBlurb(myAddr, itemId, 1);
        

        } catch (e) {
            throw e
        }

    },

    getBlurbsByItemType: async(addr, blurbType) => {

      try{
        const web3 = global.web3;
        const blurbsFactory = new web3.eth.Contract(blurbsAbi, blurbsAddr);

        let blurbs = await blurbsFactory.methods.getBlurbsByType(addr, blurbType).call();
        
        return blurbs;

      } catch(e) {
        console.log(e);
        return [];
      }
    },

    getProfileLocalDb: async(addr, forceUpdate=false) => {

      let profile = await profileDb.find({ _id: addr }).fetch();

      if(profile.length > 0 && !forceUpdate) {
        console.log('profile from local DB');
        return profile[0];
      } else {
        try {
          let profileId = await module.exports.getProfile(addr);
          if(profileId) {
            let mixItem = new MixItem(profileId);
            let _item = await mixItem.init();
            await _item.latestRevision().load();
            
            let profile = await _item.latestRevision().getProfile();
            profile.children = await module.exports.getChildren(profileId);
            profile.post = (await module.exports.getBlurbsByItemType(addr, 0));
            profile.bio = await _item.latestRevision().getBodyText();
            profile.name = await _item.latestRevision().getTitle();
            profile._id = addr;
            profile.profileItemId = profileId;
            try{
              profile.image = await _item.latestRevision().getImageMessage();
            } catch (e) {
              profile.image = null;
              console.log(e)
            }

            if(Meteor.isClient) {
              try{
              profileDb.insert({_id:profile._id, profileItemId: profile.profileItemId, name:profile.name, bio:profile.bio, location:profile.location, type:profile.type, image:profile.image, children:profile.children, post:profile.post});
              } catch(e) {
                
              }
            }  
            return profile;
          } else {
            return null;
          }
        } catch(e) {
          console.log(e)
          return null;
        }

      }
    },

    getChildren: async(itemId) => {

      try {
        const web3 = global.web3;
        const itemDagFactory = new web3.eth.Contract(itemDagAbi, itemDagFeedAddr);
        let childrenArray = await itemDagFactory.methods.getAllChildIds(itemId).call();
        return childrenArray;
      } catch (e) {
        console.log(e)
        return [];
      }

    },

    getComments: async(itemId) => {
      
      try {
        const web3 = global.web3;
        const itemDagFactory = new web3.eth.Contract(itemDagAbi, itemDagAddr);
        let childrenArray = await itemDagFactory.methods.getAllChildIds(itemId).call();
        return childrenArray;
      } catch (e) {
        console.log(e)
        return [];
      }

    },

    getAllFeedItems: async(feedItemId)=> {
      try {
        const web3 = global.web3;



      } catch(e) {


      }

    },

    donateToItem: async(myAddr, itemId, notify = null, amount = "1") => {
      try{
        const web3 = global.web3;
        const blurbsFactory = new web3.eth.Contract(blurbsAbi, blurbsAddr);

        let donateBlurb = await blurbsFactory.methods.donate(itemId);
        const encodedABI = donateBlurb.encodeABI();

        if(notify) {
          notify.update('message', 'Sending 1 Mix!');
          // notify.update('progress', 60);
        }

        //let GasPrice = await Web3Util.getGasPrice();
        let GasPrice = Session.get('gasPrice');
        let Nonce = await web3.eth.getTransactionCount(myAddr, 'pending');
        //currently just 1 mix, will update in future.
        let weiAmount = await web3.utils.toWei(amount,"ether");
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          value: web3.utils.toBN(weiAmount),
          from: myAddr,
          to: blurbsAddr,
          gas: 2500000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx, notify);
        return hash;

      } catch (e) {
        throw e
      }


    },

    initializeBlurb: async(myAddr, itemId, blurbType) => {

      try{
        const web3 = global.web3;
        const blurbsFactory = new web3.eth.Contract(blurbsAbi, blurbsAddr);

        let addBlurb = await blurbsFactory.methods.addBlurb(itemId, blurbType);
        const encodedABI = addBlurb.encodeABI();

        //let GasPrice = await Web3Util.getGasPrice();
        let GasPrice = Session.get('gasPrice');
        let Nonce = await web3.eth.getTransactionCount(myAddr, 'pending');
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: blurbsAddr,
          gas: 2500000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx);
        return hash;

      } catch (e) {
        console.log(e);
      }

    },

    getTotalDonationsForItem: async(itemId) => {
      try{
        const web3 = global.web3;
        const blurbsFactory = new web3.eth.Contract(blurbsAbi, blurbsAddr);

        let donations = await blurbsFactory.methods.getBlurbTotalDonations(itemId).call();
        return (web3.utils.fromWei(web3.utils.toBN(donations),"ether"));
      } catch(e) {
        console.log(e);
        return 0;
      }


    },

    getBlurbInfo: async(itemId) => {
      try{
        const web3 = global.web3;
        const blurbsFactory = new web3.eth.Contract(blurbsAbi, blurbsAddr);

        let blurbInfo = await blurbsFactory.methods.getBlurbInfo(itemId).call();
        console.log(blurbInfo)
        return blurbInfo;
      } catch(e) {
        console.log(e);
        return [];
      }


    },

    withdrawDonationBalance: async(myAddr, notify = null) => {

      try{
        const web3 = global.web3;
        const blurbsFactory = new web3.eth.Contract(blurbsAbi, blurbsAddr);

        let withdraw = await blurbsFactory.methods.withdraw();
        const encodedABI = withdraw.encodeABI();

        let GasPrice = await Web3Util.getGasPrice();
        
        let Nonce = await web3.eth.getTransactionCount(myAddr, 'pending');

        if(notify) {
          notify.update('message', 'Withdrawing Balance!');
          // notify.update('progress', 60);
        }

        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: blurbsAddr,
          gas: 2000000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let hash = await Web3Util.signAndSendRawTx(rawTx, notify);
        return hash;

      } catch (e) {
        console.log(e);
      }

    },

    donationBalance: async(myAddr) => {

      try{
        const web3 = global.web3;
        const blurbsFactory = new web3.eth.Contract(blurbsAbi, blurbsAddr);

        let donationBalance = await blurbsFactory.methods.currentBalance(myAddr).call();
        return (web3.utils.fromWei(String(donationBalance),"ether"));
      } catch(e) {
        console.log(e);
        return 0;
      }

    },

    cultivateMyFeed: async(myAddr) => {

      try {
        let returnFeedArray = [];
        let accountsTrusting = await module.exports.getTrustedAccounts(myAddr);
          for (let i = 0; i < accountsTrusting.length; i++) {
            
              let post = await module.exports.getBlurbsByItemType(accountsTrusting[i],0); //reverse array to get newest first
              let initItemArray = await post.slice(Math.max(post.length - 3, 0)); //get the last 2 post per each account following
              await initItemArray.forEach( async _item =>{
                if(_item){
                  await returnFeedArray.push(new MixItem(_item));
                }
              
              })
        };

        let initalizedItems = await module.exports.initAllItems(returnFeedArray);
        await initalizedItems.sort((itemA, itemB) => {
          return (itemB.latestTimeStamp() - itemA.latestTimeStamp())
        })
        
        return initalizedItems;

      } catch(e) {
        console.log('initalized'+e);
        return [];
      }

    },

    initAllItems: async(arrayOfItems) => {

      return Promise.all( arrayOfItems.map(async _item => await _item.init()) );

    },

    getImageFromMipmap:async(imageMessage, widthMin, heightMin) => {
      //let imageMessage = new jpegImageProto.JpegMipmap.deserializeBinary(this.content.getPayloads('0x12745469')[0])
      let width = imageMessage.getWidth()
      let height = imageMessage.getHeight()
      let mipmapList = imageMessage.getMipmapLevelList()
  
      let i, scale
      for (i = 0; i < mipmapList.length; i++) {
        scale = Math.pow(2, i)
        if (width / scale < widthMin * 4 || height / scale < heightMin * 4) {
          break
        }
      }
  
      let widthOut = Math.round(width / scale)
      let heightOut = Math.round(height / scale)
      //http://localhost:8081/ipfs/http://localhost:8081/ipfs/
      // return '<img src="' + Base58.encode(mipmapList[i].getIpfsHash()) + '" width="' + widthOut + '" height="' + heightOut + '">'
      if(mipmapList[i]) {
        let data = await IpfsUtil.getItemFromIpfsHash(Base58.encode(mipmapList[i].getIpfsHash()))
        return data[0].content;
      } else {
        return null;
      }
    },

    mixFeed: async(itemId) => {
      let feedItems = []
      let mixItem = new MixItem(itemId);
      let _item = await mixItem.init();
      await _item.latestRevision().load();
      let revision = await _item.latestRevision();
      console.log(revision.content)
      if (!revision.content.getPrimaryMixinId() == '0xbcec8faa') {
        throw new Error('Not a valid feed')
      } else {
        feedItems = await module.exports.getChildren(itemId);
        feedItems = await module.exports.initAllItems(feedItems);
        await feedItems.sort((itemA, itemB) => {
          return (itemB.latestTimeStamp() - itemA.latestTimeStamp())
        })
        return feedItems;
      }

    }

}