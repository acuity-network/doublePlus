global.Buffer = global.Buffer || require("buffer").Buffer;
const ipfsAPI = require('ipfs-api')
let multihashes = require('multihashes')

module.exports = {

    initIPFS: async ()=>{
        try{
            
            $.getScript("https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js", function(){
                const repoPath = 'ipfs-mix'
                global.ipfs = new Ipfs({ repo: repoPath });
                global.ipfs.on('ready', () => { 
                    
                    global.ipfs.files.get('Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a')
                    .then(res=>{
                        console.log(res);
                    })
                })               
            
             });

                // node.on('ready', () => {
                // // Ready to use!
                // // See https://github.com/ipfs/js-ipfs#core-api
                // })
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
        //const ipfs = ipfsAPI(LocalStore.get('ipfsApiURL'), '5001', {protocol: LocalStore.get('protocol')});
        const ipfs = global.ipfs;
        console.log(hash);
        let files = await ipfs.files.get(hash);
        return files;
    },

    addFile: async(data, isInfuraPost = false) => {
        const ipfs = isInfuraPost ? ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}) : ipfsAPI(LocalStore.get('ipfsApiURL'), '5001', {protocol: LocalStore.get('protocol')});
        let result = await ipfs.files.add(data);
        let hash = result[0].hash;
        return hash;
    }


};
