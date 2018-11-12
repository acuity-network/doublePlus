const trustedAccountsAbi = require('./jsonAbis/trustedAccounts.abi.json');
const trustedAccountAddr = '0xaae497797e3f9a5ff341225bd9696d9759991418';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));

const itemStoreRegistryAbi = require('../lib/jsonAbis/itemStoreRegistry.abi.json');
const itemStoreRegistry = new web3.eth.Contract(itemStoreRegistryAbi, '0xa46adddd3105715fa0ea0d4a883d4be99452c3f6');

const itemStoreShortIdAbi = require('../lib/jsonAbis/itemStoreShortId.abi.json');
const itemStoreShortId = new web3.eth.Contract(itemStoreShortIdAbi, '0xd02ee768718b41a8cea9350d7c4c443727da5c7b')

const itemStoreAbi = require('../lib/jsonAbis/itemStoreInterface.abi.json');
//const itemStoreFactory = new web3.eth.Contract(itemStoreAbi, '0xdf37447c7c3b241be8dc5dfc70103d3fa7fee1a6');


const itemStoreIpfsSha256Addr = '0xe059665fe0d226f00c72e3982d54bddf4be19c6c';
const itemStoreIpfsSha256Abi = require('../lib/jsonAbis/itemStoreIPFSSha256.abi.json');
//const itemStoreIpfsSha256Factory = new web3.eth.Contract(itemStoreIpfsSha256Abi);

const accountProfileAbi = require('../lib/jsonAbis/AccountProfile.abi.json');
const accountProfileAddr = '0x72f52ab6b1d15630ee9b2d8763b23478c0327df8';
//const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr)

const multihashes = require('multihashes');
const itemPb = require("./protobuf/item_pb.js");
const mixinmixin = require("./protobuf/mixin-mixin_pb.js");
const jpegmixin = require("./protobuf/mix_jpeg_mipmap_pb.js");
const brotli = require("../lib/brotli/brotli.js");
var bro = new brotli.Brotli();
const Base58 = require("base-58");


module.exports = {

    getItembyId: async (itemId) => {


        try{
          const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
          const itemStoreRegistry = new web3.eth.Contract(itemStoreRegistryAbi, '0xa46adddd3105715fa0ea0d4a883d4be99452c3f6');

          let itemStoreAddress = await itemStoreRegistry.methods.getItemStore(itemId).call();
          console.log(itemStoreAddress);
      
          if (itemStoreAddress == "0x") {
            console.log("Item store not found for item.");
          }
      
          let itemStore = new web3.eth.Contract(itemStoreAbi, itemStoreAddress);
      
          let abiVersion = await itemStore.methods.getAbiVersion().call();
          console.log(abiVersion);
          
          let inUse = await itemStore.methods.getInUse(itemId).call();

          if(!inUse) {
            console.log(inUse);
            return;
          }

          let contractId = await itemStore.methods.getContractId().call();
      
          console.log(contractId);
          if (contractId != "0x2d54bddf4be19c6c") {
            console.log("Unknown item store.");
            return;
          }
          console.log('d'+itemStoreAddress);
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
          console.log(file);
          return jsonItem;

      } catch(e) {
        console.log(e);
      }

    },

    getTrustedAccounts:async (addr) => {
      const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
      let trustedAccounts = new web3.eth.Contract(trustedAccountsAbi, trustedAccountAddr);
      
      let trusted = await trustedAccounts.methods.getAllTrustedByAccount(addr).call();
      console.log(trusted);
      return (trusted);

    },

    addTrustedAccount:async (myAddr, trustedAddr)=> {

      const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));

      const trustedAccounts = new web3.eth.Contract(trustedAccountsAbi, trustedAccountAddr);
      const addTrusted = trustedAccounts.methods.trustAccount(trustedAddr);
      const encodedABI = addTrusted.encodeABI();

      let gasEst = await addTrusted.estimateGas();
      console.log(gasEst)

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
        showProgressbar: true,
        placement: {
            from: "bottom",
            align: "center"
        }
      });

      let GasPrice = await Web3Util.getGasPrice();
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

      let res = await Web3Util.signAndSendRawTx(rawTx,notify);


    },

    removeTrustedAccount:async(addr)=> {


    },

    numberOfAccountsTrusting:async(addr) => {

      const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));

      let trustedAccounts = new web3.eth.Contract(trustedAccountsAbi, trustedAccountAddr);
      
      let count = await trustedAccounts.methods.getTrustedCountByAccount(addr).call();
      console.log(count);
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
      console.log(returnArray);
      return returnArray;

    },


    accountHasProfile: async(addr) => {

      const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
      const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
      try {
        return await accountProfile.methods.hasProfile(addr).call();
      } catch (e) {
        console.log(e.message)
        return false;
      }
    },

    associateProfileToAccount: async(myAddr, mixAccountItemId) => {
      const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
      
      const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
      
        try {
          console.log(mixAccountItemId);
          const setProfile = accountProfile.methods.setProfile(mixAccountItemId);
          const encodedABI = setProfile.encodeABI();
          console.log('here')
          //let gasEst = await setProfile.estimateGas();
          //gasEst = gasEst +gasEst;
          //console.log(gasEst);

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
            showProgressbar: true,
            placement: {
                from: "bottom",
                align: "center"
            }
          });

          let GasPrice = await Web3Util.getGasPrice();
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

          let res = await Web3Util.signAndSendRawTx(rawTx,notify);
          console.log('profiletx', res);
          return res;
        } catch (e) {
          console.log(e.message);
        }
      
    },

    getProfile: async(addr) => {
      try {

        const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
        let profileId = await accountProfile.methods.getProfileByAccount(addr).call();
        return profileId;

      } catch (e) {
        console.log(e.message);
        return null;
      }
    },


    createOrReviseMyProfile: async(ipfsHash, myAddr) => {
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        const accountProfile = new web3.eth.Contract(accountProfileAbi, accountProfileAddr);
        accountProfile.getPastEvents("allEvents",(e,events)=>{console.log(events)})
        let myProfile = await module.exports.getProfile(myAddr);
        console.log('my profile',myProfile)
        if(myProfile == null || myProfile == '0x') {
          
          await module.exports.createProfile(ipfsHash, myAddr);

        } else {
          
          await module.exports.reviseProfile(myProfile, ipfsHash, myAddr);

        }

      } catch (e) {
        console.log(e.message)

      }
    },

    createProfile: async(ipfsHash, myAddr) => {

      try {
        
        const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        let flagsNonce = '0x01' + web3.utils.randomHex(30).substr(2);
        let itemId = await module.exports.getItemId(flagsNonce, myAddr);

        await module.exports.createNewItem(myAddr,ipfsHash,flagsNonce);
        await module.exports.associateProfileToAccount(myAddr, itemId);  

      } catch(e) {
       console.log(e.message)
      }

    },

    reviseProfile: async(profileId, ipfsHash, myAddr) => {

      const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
      const accountProfile = new web3.eth.Contract(accountProfileAbi, );

    },

    getItemId: async(flagsNonce,myAddr) => {
      
      const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
      const itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, itemStoreIpfsSha256Addr);
      let itemId = await itemStoreIpfsSha256.methods.getNewItemId(flagsNonce).call({from:myAddr});
      return itemId;

    },

    //accepts optional parent array of itemIds and calls the corresponding contract method depending on parentss count.
    createNewItem: async(myAddr, ipfsHash, flagsNonce, parents = []) => {
      
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        
        const itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, itemStoreIpfsSha256Addr);
        let createItem;

        if(parents.length == 0) {
          createItem = await itemStoreIpfsSha256.methods.create(flagsNonce,ipfsHash);
        } else  if(parents.length == 1) {
          createItem = await itemStoreIpfsSha256.methods.createWithParent(flagsNonce,ipfsHash,parents[0]);
        } else if (parents.length > 1){
          createItem = await itemStoreIpfsSha256.methods.createWithParents(flagsNonce,ipfsHash,parents);
        } else {
          throw 'parent error';
        }
        
        const encodedABI = createItem.encodeABI();

        let gasEst = await createItem.estimateGas();

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
          showProgressbar: true,
          placement: {
              from: "bottom",
              align: "center"
          }
        });

        let GasPrice = await Web3Util.getGasPrice();
        let Nonce = await web3.eth.getTransactionCount(myAddr);
      
        let rawTx = {
          nonce:Nonce,
          chainId:76,
          from: myAddr,
          to: itemStoreIpfsSha256Addr,
          gas: 2500000,
          data: encodedABI,
          gasPrice:GasPrice
        }; 

        let res = await Web3Util.signAndSendRawTx(rawTx,notify);

        return res;

      } catch (e) {
        throw e
      }

    }


}