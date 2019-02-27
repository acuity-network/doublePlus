global.Buffer = global.Buffer || require("buffer").Buffer;
const ipfsAPI = require('ipfs-api')
let multihashes = require('multihashes')
 //const IPFS = require('ipfs')


module.exports = {

    initIPFS: async (useSecondaryScript = false)=>{
        Session.set('ipfsConnected',false);
        console.log(window.ipfs)

        if (LocalStore.get('browserIpfs') == null) {LocalStore.set('browserIpfs', false)}
            console.log(window.ipfs);
            // if(window.ipfs) {

            //     global.ipfs = await window.ipfs.enable();
            //     Session.set('IpfsCompanion', true);
            //     Session.set('ipfsConnected',false);
            //     Session.set('ipfsId',null);
            //     Session.set('ipfsAPI','Ipfs Companion')
            //     let hash = 'QmS8hKtny73KoTh8cL2xLoLHjMDjkG9WYF3AHAdd9PHkxo';
            //     global.ipfs.get(hash).then(files =>{

            //             console.log(files)
            //         })
            //         let files = await module.exports.getItemFromIpfsHash('Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a',false);
            //         if(files && files.length > 0) {
            //             $.notify({
            //                 icon: 'glyphicon glyphicon-success-sign',
            //                 title: '',
            //                 message: 'IPFS daemon successfully started in browser! ',
            //                 target: '_blank',
            //                 allow_dismiss: false,
            //             },{
            //                 animate: {
            //                     enter: 'animated fadeInDown',
            //                     exit: 'animated fadeOutUp'
            //                 },
            //                 type:'success',
            //                 showProgressbar: false,
            //                 placement: {
            //                     from: "bottom",
            //                     align: "center"
            //                 }
            //             });

            //             Session.set('ipfsConnected',true);
            //         }
            //         let id = await ipfs.id();
        
            //         Session.set('ipfsId', id.id);
         

            // } else 
            if(LocalStore.get('browserIpfs')) {
                //let scriptURL = useSecondaryScript ? "https://unpkg.com/ipfs@0.34.2/dist/index.min.js" : "https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js";
                let scriptURL = "https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js";
                $.getScript(scriptURL, async ()=>{

                 
                    const repoPath = 'ipfs-repo'
                    //global.ipfs = await window.ipfs.enable();

                    global.ipfs =  new Ipfs({ 
                          repo:  repoPath,
                          config:{
                            Addresses: {
                                Swarm: [
                                ],
                                API: '',
                                Gateway: ''
                            },
                            Discovery: {
                                MDNS: {
                                Enabled: false,
                                Interval: 10
                                },
                                webRTCStar: {
                                Enabled: true
                                }
                            },
                            Bootstrap: [
                                '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
                                '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
                                '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
                                '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
                                '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
                                '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
                                '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
                                '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6'
                            ]
                        },
                    
                    });

                    

                    Session.set('ipfsAPI','JS-Ipfs')


                    global.ipfs.on('ready', async () => { 
                    let peers
                        peers = await window.ipfs.swarm.peers() // empty peers (still connecting)
                        console.log(peers)
                        console.log('myid', await global.ipfs.id())
                        setTimeout( async() => {
                            peers = await window.ipfs.swarm.peers() // several peers (connected now)
                            console.log(peers)
                            
                            //const peerId = await window.ipfs.dht.findpeer('QmWLiP6qKSii1kfRuxXTev7C7Ck7XYbz8Rq92HZerui1cu')

                            //console.log('peerId', peerId)
                            
                        }, 20000)
                    
                        Session.set('ipfsConnected',false);
                        Session.set('ipfsId',null);
                        let hash = 'QmS8hKtny73KoTh8cL2xLoLHjMDjkG9WYF3AHAdd9PHkxo';
                        window.ipfs.get(hash).then(files =>{

                            console.log(files)
                        })
                        let files = await module.exports.getItemFromIpfsHash('Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a',false);
                        if(files && files.length > 0) {
                            $.notify({
                                icon: 'glyphicon glyphicon-success-sign',
                                title: '',
                                message: 'IPFS daemon successfully started in browser! ',
                                target: '_blank',
                                allow_dismiss: false,
                            },{
                                animate: {
                                    enter: 'animated fadeInDown',
                                    exit: 'animated fadeOutUp'
                                },
                                type:'success',
                                showProgressbar: false,
                                placement: {
                                    from: "bottom",
                                    align: "center"
                                }
                            });

                            Session.set('ipfsConnected',true);
                        }
                        let id = await ipfs.id();
            
                        Session.set('ipfsId', id.id);
        
                        
                    })
                    // }catch(e) {
                    //     module.exports.initIPFS(true);
                    // }
                
                });
                
            } else {
                global.ipfs = ipfsAPI(LocalStore.get('ipfsApiURL'), '5001', {protocol: LocalStore.get('protocol')});
                Session.set('ipfsConnected',false);
                Session.set('ipfsId',null);

                Session.set('ipfsAPI','Localhost')

                let files = await module.exports.getItemFromIpfsHash('Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a', false);
                if(files && files.length > 0) {
                    Session.set('ipfsConnected',true);
                }

                let id = await ipfs.id();
                Session.set('ipfsId', id.id);
          
        }
        // } catch(e) {
            
        //     console.log(e);

        // }
        
    },

    getItemFromHexHash: async(hash) => {
        let encodedIpfsHash = await multihashes.toB58String(multihashes.encode(Buffer.from(hash.substr(2), "hex"), 'sha2-256'));
        let returnArray = await module.exports.getItemFromIpfsHash(encodedIpfsHash, true);
        return returnArray;
        
    },

    getItemFromIpfsHash: async(hash, isTimer) => {
        console.log(hash)
        console.log(global.ipfs)
        isTimer = false
        const ipfs = global.ipfs;
        let promise = new Promise((resolve, reject) => {
            ipfs.get(hash).then(files =>{

                console.log(files)
                resolve(files);

            });
        
        })

        if(isTimer) {
            let ms = 20000;
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

