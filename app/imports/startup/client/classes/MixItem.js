const itemStoreRegistryAbi = require('../lib/jsonAbis/itemStoreRegistry.abi.json');
const itemStoreShortIdAbi = require('../lib/jsonAbis/itemStoreShortId.abi.json');
const itemStoreAbi = require('../lib/jsonAbis/itemStoreInterface.abi.json');
const itemStoreIpfsSha256Abi = require('../lib/jsonAbis/itemStoreIPFSSha256.abi.json');
const Web3 = require('web3');
import itemProto from '../lib/protobuf/item_pb.js';
import MixRevision from './MixRevision.js';

export default class MixItem {

  constructor(itemId) {
    this.itemId = itemId
  }

  async init () {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        
        this.itemStoreRegistry = new web3.eth.Contract(itemStoreRegistryAbi, '0xa46adddd3105715fa0ea0d4a883d4be99452c3f6');
        this.itemStoreShortId = new web3.eth.Contract(itemStoreShortIdAbi, '0xd02ee768718b41a8cea9350d7c4c443727da5c7b');
        this.itemStoreAddress = await this.itemStoreRegistry.methods.getItemStore(this.itemId).call();

        this.itemStore = new web3.eth.Contract(itemStoreAbi, this.itemStoreAddress);
        
            
        let inUse = await this.itemStore.methods.getInUse(this.itemId).call();
        
        console.log(inUse);
        
        if (!inUse) {
            throw 'Item not found.'
        } 
        let contractId = await this.itemStore.methods.getContractId().call();
        console.log(contractId);
        if (contractId != "0x2d54bddf4be19c6c") {
            throw 'Unknown item store.'
        }  
        this.itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, this.itemStoreAddress);
            
        this.item = await this.itemStoreIpfsSha256.methods.getItem(this.itemId).call();
        this.revisions = [];

        for (var i = 0; i < this.item.revisionCount; i++) {
            await this.revisions.push(new MixRevision(this, i));
            console.log(this);
        }

        return(this);
    } catch (e) {
        
        throw e;
    }
 
  }

  itemId() {
    return this.itemId
  }

  isUpdatable() {
    return this.item.flags & 1
  }

  parentIds() {
    return this.item.parentIds
  }

  childIds() {
    return this.item.childIds
  }

  revisions() {
    return this.revisions
  }

  latestRevision() {
    return this.revisions[this.item.revisionCount - 1]
  }

  get exists() {
  }

  get shortId() {
  }

//   async isTrusted() {
//     if (Session.get('addr') == this.item.owner) {
//       return true
//     }
//     return await window.activeAccount.call(this.vue.$trustedAccounts.methods.getIsTrustedDeep(this.item.owner))
//   }

//   async getTrustLevel() {
//     if (window.activeAccount.contractAddress == this.item.owner) {
//       return 1
//     }
//     if (await window.activeAccount.call(this.vue.$trustedAccounts.methods.getIsTrusted(this.item.owner))) {
//       return 2
//     }
//     if (await window.activeAccount.call(this.vue.$trustedAccounts.methods.getIsTrustedOnlyDeep(this.item.owner))) {
//       return 3
//     }
//     return 0
//   }

//   async getTrustLevelToggled() {
//     var level = await this.getTrustLevel()

//     switch (level) {
//       case 0:
//         return 2

//       case 1:
//         return 1

//       case 2:
//         if (await window.activeAccount.call(this.vue.$trustedAccounts.methods.getIsTrustedOnlyDeep(this.item.owner))) {
//           return 3
//         }
//         return 0

//       case 3:
//         return 2
//     }
//   }
}