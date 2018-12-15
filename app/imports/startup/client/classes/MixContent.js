const multihashes = require('multihashes');
import brotliLib from '../lib/brotli/brotli.js';
const brotli = new brotliLib.Brotli();
const IpfsUtil = require('../lib/ipfsUtil.js');
import itemProto from '../lib/protobuf/item_pb.js';


export default class MixContent {

  constructor() {

    this.mixins = []
  }

  async load(ipfsHash) {
    let encodedIpfsHash = multihashes.toB58String(multihashes.encode(Buffer.from(ipfsHash.substr(2), "hex"), 'sha2-256'))
    let response = await IpfsUtil.getItemFromIpfsHash(encodedIpfsHash);
    console.log('res',response)
    console.log(response[0].content);
    let itemPayload = new Uint8Array(Buffer.from(response[0].content, "binary"));
    let item = await brotli.decompressArray(itemPayload);
    console.log(itemProto.Item.deserializeBinary(item));
    let mixins = itemProto.Item.deserializeBinary(item).getMixinList()
    console.log('d'+item);

    for (let i = 0; i < mixins.length; i++) {
      await this.mixins.push({
        mixinId: '0x' + ('00000000' + mixins[i].getMixinId().toString(16)).slice(-8),
        payload: mixins[i].getPayload(),
      })
    
    }
    
  }

  async save() {
    let itemMessage = new itemProto.Item()

    for (let i = 0; i < this.mixins.length; i++) {
      let mixinMessage = new itemProto.Mixin()
      mixinMessage.setMixinId(this.mixins[i].mixinId)
      if (this.mixins[i].payload) {
        mixinMessage.setPayload(this.mixins[i].payload)
      }
      itemMessage.addMixin(mixinMessage)
    }

    console.log(Buffer.from(itemMessage.serializeBinary(),"binary"));
    let payload = await brotli.compressArray(new Uint8Array(Buffer.from(itemMessage.serializeBinary(),"binary")),11);
    var payloadBuffer = Buffer.from(payload)
    let hash = await IpfsUtil.addFile(payloadBuffer);
    let infuraHash = await IpfsUtil.addFile(payloadBuffer, true);
    console.log(hash, infuraHash, 'infura');
    let decodedHash = multihashes.decode(multihashes.fromB58String(hash));

    if (decodedHash.name != 'sha2-256') {
      throw 'Wrong type of multihash.'
    }

    return '0x' + decodedHash.digest.toString('hex')
  }

  getMixins() {
    return this.mixins
  }

  getPrimaryMixinId() {
    return this.mixins[0].mixinId
  }

  getPayloads(mixinId) {
    let payloads = []
    for (let i = 0; i < this.mixins.length; i++) {
      if (this.mixins[i].mixinId == mixinId) {
        payloads.push(this.mixins[i].payload)
      }
    }
    return payloads
  }

  addMixin(mixinId, payload) {
    this.mixins.push({
      mixinId: mixinId,
      payload: payload,
    })
  }

  removeMixins(mixinId) {
    let newMixins = []
    for (let i = 0; i < this.mixins.length; i++) {
      if (this.mixins[i].mixinId != mixinId) {
        newMixins.push(this.mixins[i])
      }
    }
    this.mixins = newMixins
  }

}
