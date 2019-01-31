

const Web3 = require('web3');
const BN = Web3.utils.BN;
const accountProfileAddr = '0x7855a6b883c39c8e87d51002b064180ddbf16026';

module.exports = {
    
    initWeb3: async () => {
        Session.set('blockNum', 0);
        if(!LocalStore.get('nodeURL')) {
            LocalStore.set('nodeURL', "https://rpc.doubleplus.io/");
        }

        Session.set('gasPrice', 1);
        Session.set('hashRate', null);
        Session.set('peers',null);
        Session.set('blockNum',null);
        global.web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        global.web3.eth.defaultBlock = "pending";
        try {
            let block = await web3.eth.getBlockNumber();
            if (block > 1) {
                Session.set('blockNum', block);
                $.notify({
                    icon: 'glyphicon glyphicon-success-sign',
                    title: '',
                    message: 'Connected to Mix Blockchain - Current Block: '+ block,
                    target: '_blank'
                },{
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                    type:'success',
                    placement: {
                        from: "bottom",
                        align: "center"
                    },
                    timer:8000
                });
                
            }
            let hashRate = await web3.eth.getHashrate();
            Session.set('hashRate', hashRate);
            let peers = await web3.eth.net.getPeerCount();
            Session.set('peers',peers);

        } catch(e) {
            console.log(e);
        }
        
    },

    getBalance: async(addr) => {
        try{
            const web3 = global.web3;
            web3.eth.defaultBlock = "pending";
            let bal = await web3.eth.getBalance(addr);
            let ethBal = await web3.utils.fromWei(bal,"ether");
            return ethBal;
        } catch(e) {
            throw e;
        }
    },

    getUnconfirmedBalance: async(addr) => {
        try{
            const web3 = global.web3;
            let bal = await web3.eth.getBalance(addr);
            let ethBal = await web3.utils.fromWei(bal,"ether");
            return ethBal;
        } catch(e) {
            throw e;
        }
    },

    signAndSendRawTx: (rawTx, notify = null) => { return new Promise(async function(resolve, reject) {
            let privKey = Session.get('priv');
            if (!privKey) {
                console.log('not logged in');
            }
            let tx = await new EthTx(rawTx);
            
            
            let privateKey = await new Buffer(privKey, 'hex')
            await tx.sign(privateKey);
            let serializedTx = await tx.serialize();
            let hexTx = serializedTx.toString('hex');

            try {
                const web3 = global.web3;
                
                if(notify) { 
                    // notify.update('progress', 95);
                }
                web3.eth.sendSignedTransaction('0x'+ hexTx)
                .on('transactionHash', (hash) => {
                    
                    if(notify) {
                        notify.update('type', 'success');
                        notify.update('message', 'Transactions sent.  TxHash : '+ hash);
                        // notify.update('progress', 99);
                    }
                    console.log('tx hash: '+hash);
                    resolve(hash);
                })
                .on('receipt', function(receipt) { 
        
                    console.log('receipt',receipt);
                    $.notify({
                        icon: 'glyphicon glyphicon-success-sign',
                        title: '',
                        message: 'Transaction successfully included in block: ' + receipt.blockNumber,
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

                    ////HANDLE UPDATES BASED ON TO CONTRACT ID
                    if(receipt.to == accountProfileAddr) {
                        MixUtil.getProfile(Session.get('addr'))
                        .then(profile =>{
                            Session.set('profile', profile);
                        })
                        
                    };

                })
                .on('error', (error) => {
                    if(notify) {
                        notify.update('message', error);
                        notify.update('type', 'danger');
                    }
                    reject(error);
                });

            } catch(e) {
                console.log(e.message)
            }
        })
    },

    sendTo:async(fromAddr,toAddr,ethAmount) => {
        try{
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
            const web3 = global.web3;
            let GasPrice = await web3.eth.getGasPrice();
            let Nonce = await web3.eth.getTransactionCount(fromAddr);
            let weiAmount = await web3.utils.toWei(ethAmount,"ether");
            let rawTx = await {
                nonce:Nonce,
                chainId:76,
                to: toAddr,
                value: web3.utils.toBN(weiAmount),
                gas: 25000,
                gasPrice: web3.utils.toBN(GasPrice)
            };
            console.log('raxTx ' + rawTx);
            let ret = Web3Util.signAndSendRawTx(rawTx, notify);
        } catch (e) {
            console.error(e.message);
        }
    },

    getGasPrice: async () =>{
        const web3 = global.web3;
        let GasPrice = await web3.eth.getGasPrice();
        return web3.utils.toBN(GasPrice)
    },

    isAddress: (addr)=>{
        const web3 = global.web3;
        return web3.utils.isAddress(addr);
    }

};