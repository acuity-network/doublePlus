

const Web3 = require('web3');
const BN = Web3.utils.BN;

module.exports = {
    
    initWeb3: async () => {
        if(!LocalStore.get('nodeURL')) {
            LocalStore.set('nodeURL', "http://145.249.107.233:8645");
        }

        Session.set('gasPrice', null);
        Session.set('hashRate', null);
        Session.set('peers',null);
        Session.set('blockNum',null);
        const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
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
            let price = await web3.eth.getGasPrice();
            console.log(price);
            Session.set('gasPrice', price);
            let hashRate = await web3.eth.getHashrate();
            Session.set('hashRate', hashRate);
            console.log(hashRate);
            let peers = await web3.eth.net.getPeerCount();
            Session.set('peers',peers);

            

        } catch(e) {
            console.log(e);
        }
        
    },

    getBalance: async(addr) => {
        try{
            const web3 = await new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
            let bal = await web3.eth.getBalance(addr);
            let ethBal = await web3.utils.fromWei(bal,"ether");
            return ethBal;
        } catch(e) {
            throw e;
        }
    },

    signAndSendRawTx: async(rawTx, privKey, notify = null) => {
        console.log('here');
        console.log(EthTx);
        let tx = await new EthTx(rawTx);
        if(notify) {    
            notify.update('progress', 25);
            notify.update('message', 'Signing Transaction...');
        }
        
        
        let privateKey = await new Buffer(privKey, 'hex')
        await tx.sign(privateKey);
        let serializedTx = await tx.serialize();
        let hexTx = serializedTx.toString('hex');
        if(notify) {    
            notify.update('progress', 50);
            notify.update('message', 'Broadcasting Tranaction...');
        }
        try {
            const web3 = await new Web3 (new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
            console.log(hexTx);

            notify.update('progress', 95);
            web3.eth.sendSignedTransaction('0x'+ hexTx).on('transactionHash', function(hash){
                notify.update('type', 'success');
                notify.update('message', 'Transactions sent.  TxHash : '+ hash);
                notify.update('progress', 99);
                return hash;
            })
            .on('receipt', function(receipt){
                console.log(receipt);
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

            })
            .on('error', function(error){
                notify.update('message', error);
                notify.update('type', 'danger');
            
            });
                     

        } catch(e) {
            console.log(e.message);
            throw e;
        }
    },

    sendTo:async(fromAddr,toAddr,ethAmount,privKey) => {
        //try{
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
            web3 = new Web3 (new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
            let GasPrice = await web3.eth.getGasPrice();
            let Nonce = await web3.eth.getTransactionCount(fromAddr);
            console.log(GasPrice);
            console.log(ethAmount);
            let weiAmount = await web3.utils.toWei(ethAmount,"ether");
            console.log(weiAmount);
            console.log(GasPrice, 51000000000);
            let rawTx = await {
                nonce:Nonce,
                chainId:76,
                to: toAddr,
                value: web3.utils.toBN(weiAmount),
                gas: 25000,
                gasPrice: web3.utils.toBN(GasPrice)
            };
            console.log(rawTx);
            let res = await Web3Util.signAndSendRawTx(rawTx,privKey,notify);
            console.log(res);
        //} catch (e) {
         //   console.error(e);
        //}

        
    },

    getGasPrice: async () =>{
        web3 = new Web3 (new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        let GasPrice = await web3.eth.getGasPrice();
        return web3.utils.toBN(GasPrice)
    },

    isAddress: (addr)=>{
        const web3 = new Web3(new Web3.providers.HttpProvider(LocalStore.get('nodeURL')));
        return web3.utils.isAddress(addr);
    }

};