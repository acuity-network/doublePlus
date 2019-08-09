global.Buffer = global.Buffer || require("buffer").Buffer;
const ipfsAPI = require('ipfs-api')
let multihashes = require('multihashes')


module.exports = {

    initIPFS: async (useSecondaryScript = false)=>{
        Session.set('ipfsConnected',false);
      
        // if (LocalStore.get('browserIpfs') == null) {LocalStore.set('browserIpfs', true)}
        
        // try{
        //     if(LocalStore.get('browserIpfs')) {
        //         // //let scriptURL = useSecondaryScript ? "https://cdn.jsdelivr.net/npm/ipfs/dist/index.js" : "https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js";
        //         // let scriptURL = "https://unpkg.com/ipfs/dist/index.min.js";
        //         // $.getScript(scriptURL, async ()=>{
                 
        //             try{
        //                 const repoPath = 'ipfs-mix'
                        
        //                 global.ipfs = new Ipfs({ repo: repoPath,
        //                     Bootstrap: [
        //                         '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
        //                         '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
        //                         '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
        //                         '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
        //                         '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
        //                         '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
        //                         '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
        //                         '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
        //                         '/dns4/ipfsnode1.doubleplus.io/tcp/443/wss/ipfs/QmfSixk6TRydrrQo5KFgyby1QeMPkNSVV8R3AQgBtHYyPw'
        //                     ]
        //                 });

        //                 //'/dns4/ipfsnode1.doubleplus.io/tcp/443/wss/ipfs/QmfSixk6TRydrrQo5KFgyby1QeMPkNSVV8R3AQgBtHYyPw'
                    
        //                 global.ipfs.on('ready', async () => { 
        //                     Session.set('ipfsConnected',false);
        //                     Session.set('ipfsId',null);
        //                     let files = await module.exports.getItemFromIpfsHash('Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a',false);
        //                     if(files && files.length > 0) {
        //                         $.notify({
        //                             icon: 'glyphicon glyphicon-success-sign',
        //                             title: '',
        //                             message: 'IPFS daemon successfully started in browser! ',
        //                             target: '_blank',
        //                             allow_dismiss: false,
        //                         },{
        //                             animate: {
        //                                 enter: 'animated fadeInDown',
        //                                 exit: 'animated fadeOutUp'
        //                             },
        //                             type:'success',
        //                             showProgressbar: false,
        //                             placement: {
        //                                 from: "bottom",
        //                                 align: "center"
        //                             }
        //                         });

        //                         Session.set('ipfsConnected',true);
        //                     }
        //                     let id = await ipfs.id();
                
        //                     Session.set('ipfsId', id.id);
            
                            
        //                 })
        //             }catch(e) {
        //                 module.exports.initIPFS(false);
        //             }
                
        //         // });
                
        //     } else {
                global.ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
                Session.set('ipfsConnected',false);
                Session.set('ipfsId',null);

                let files = await module.exports.getItemFromIpfsHash('Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a', false);
                if(files && files.length > 0) {
                    Session.set('ipfsConnected',true);
                }

                let id = await ipfs.id();
                Session.set('ipfsId', id.id);
          
        },
        // } catch(e) {
            
        //     console.log(e);

        // }
        
    

    getItemFromHexHash: async(hash) => {
        let encodedIpfsHash = await multihashes.toB58String(multihashes.encode(Buffer.from(hash.substr(2), "hex"), 'sha2-256'));
        let returnArray = await module.exports.getItemFromIpfsHash(encodedIpfsHash, true);
        return returnArray;
        
    },

    catFileFromHash: async(hash) => {
        const ipfs = global.ipfs;
        let data = await ipfs.cat(hash);
        console.log(data)
        return data;
    },

    getItemFromIpfsHash: async(hash, isTimer) => {

        const ipfs = global.ipfs;
        let promise = new Promise((resolve, reject) => {
            ipfs.get(hash).then(files =>{resolve(files)});
        
        })

        if(isTimer) {
            let ms = 10000;
            // let retryAfter = 5000;
            
            //timeoutAfter certain ms (cant find hash)
            let timeout = new Promise((resolve, reject) => {
                let id = setTimeout(() => {
                    clearTimeout(id);
                    reject('Timed out in '+ ms + 'ms.')
                }, ms)
            })

            // //retry after certain ms
            // let retry = new Promise((resolve, reject) => {
            //     let id2 = setTimeout(() => {
            //         clearTimeout(id2);
            //         ipfs.get(hash).then(files =>{
            //             clearTimeout(id2);
            //             resolve(files);
            //         });
                
            //     }, retryAfter)
            // }) 
            
            return Promise.race([promise, timeout]);
            //return Promise.race([promise,timeout,retry]); 
        
        } else {
            return promise;
        };
    },

    addFile: async(data, isInfuraPost = false) => {
        const ipfs = isInfuraPost ? ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}) : global.ipfs;
        let result = await ipfs.add(data);
        let hash = result[0].hash;
        return hash;
    },

    addFileReturnData: async(data) => {
        const ipfs = global.ipfs;
        let result = await ipfs.add(data);
        //let res = await module.exports.addFile(data, true);
        return result[0];
    },

    addFiles: async(dataArray, isInfuraPost = false) => {
        let hashes = [];
        const ipfs = isInfuraPost ? ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}) : global.ipfs;
        await dataArray.forEach(async data=>{
            try{

                let result = await ipfs.add(data);
                hashes.push(result[0].hash);

            }catch(e) {
                console.log(e)
            }

        })
        return hashes;
    },

    pinHash: async(hash, isInfuraPost = false) => {
        const ipfs = isInfuraPost ? ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}) : global.ipfs;
        let result = await ipfs.pin.add(hash);
        return result;

    }


};
