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
const trustedAccountAddr = '0xaae497797e3f9a5ff341225bd9696d9759991418';

const itemDagAbi = require('../lib/jsonAbis/ItemDag.abi.json');
const itemDagAddr = '0xbd3af0bdcf4c8a6dfd8f6ff2129409632decfc7e';

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
        
        this.itemStoreRegistry = new web3.eth.Contract(itemStoreRegistryAbi, itemStoreRegistryAddr);
        this.itemStoreShortId = new web3.eth.Contract(itemStoreShortIdAbi, itemStoreShortIdAddr);
        this.itemStoreAddress = await this.itemStoreRegistry.methods.getItemStore(this.itemId).call();

        this.itemStore = new web3.eth.Contract(itemStoreAbi, this.itemStoreAddress);
        
            
        let inUse = await this.itemStore.methods.getInUse(this.itemId).call();
        
        if (!inUse) {
            throw 'Item not found.'
        } 
        let contractId = await this.itemStore.methods.getContractId().call();

        if (contractId != "0x1f1e136d1003177d") {
            throw 'Unknown item store.'
        }  
        this.itemStoreIpfsSha256 = new web3.eth.Contract(itemStoreIpfsSha256Abi, this.itemStoreAddress);
            
        this.item = await this.itemStoreIpfsSha256.methods.getItem(this.itemId).call();
        this.revisions = [];

        for (var i = 0; i < this.item.revisionCount; i++) {
            await this.revisions.push(new MixRevision(this, i));
        }

        return(this);
    } catch (e) {
        
        console.log(e)
    }
 
  }

  owner() {
    return this.item.owner
  }

  latestTimeStamp() {
    return this.item.timestamps[this.item.timestamps.length - 1]
  }

  itemId() {
    return this.itemId
  }

  isUpdatable() {
    return this.item.flags & 1
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