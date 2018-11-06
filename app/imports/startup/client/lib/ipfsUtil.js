global.Buffer = global.Buffer || require("buffer").Buffer;
const ipfsAPI = require('ipfs-api')
let multihashes = require('multihashes')

module.exports = {

    initIPFS: async()=>{
        try{
            const ipfs = ipfsAPI(LocalStore.get('ipfsApiURL'), '5001', {protocol: LocalStore.get('protocol')});
            //let res = await ipfs.bootstrap.list();
            Session.set('ipfsConnected',false);
            Session.set('ipfsId',null);
            //console.log(res);
            //test ipfs connection
            let files = await module.exports.getItemFromIpfsHash('Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a');
            if(files && files.length > 0) {
                Session.set('ipfsConnected',true);
            }
            let id = await ipfs.id();
            console.log(id);
            Session.set('ipfsId', id.id);
            console.log(files);
        } catch(e) {
            
            console.log(e);

        }
        
    },

    getItemFromHexHash: async(hash) => {
        let encodedIpfsHash = await multihashes.toB58String(multihashes.encode(Buffer.from(hash.substr(2), "hex"), 'sha2-256'));
        let returnArray = await module.exports.getItemFromIpfsHash(encodedIpfsHash);
        return returnArray;
        
    },

    getItemFromIpfsHash: async(hash) => {
        const ipfs = ipfsAPI(LocalStore.get('ipfsApiURL'), '5001', {protocol: LocalStore.get('protocol')});
        console.log(hash);
        let files = await ipfs.files.get(hash);
        // ipfs.files.get(hash)
        // .then((files)=>{
        //     console.log(files);
        //     return files;

        // });
        return files;
    },

    addFile: async(data) => {
        const ipfs = ipfsAPI(LocalStore.get('ipfsApiURL'), '5001', {protocol: LocalStore.get('protocol')});
        let result = await ipfs.files.add(data);
        let hash = result[0].hash;
        return hash;
    }


};
