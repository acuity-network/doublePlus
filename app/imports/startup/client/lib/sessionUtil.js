
module.exports = {
    
    logOut: () => {
        Session.set('loggedIn', null);
        Session.set('wallet', null);
        Session.set('priv', null);
        Session.set('addr', null)

    },
    
    logIn: async (privKey) => { return new Promise((resolve,reject) => {
        try{
            let buff = new Buffer(privKey, 'hex');
            let wallet = EthWallet.fromPrivateKey(buff);

            Session.set('loggedIn', true);
            Session.set('priv', privKey);
            Session.set('addr', wallet.getAddressString());

            Web3Util.getBalance(wallet.getAddressString()).then((res,e)=>{
                console.log(res);
                Session.set('balance',res);
            });

            resolve();
        } catch(e) {
            reject(e);
        }

    });

},


}