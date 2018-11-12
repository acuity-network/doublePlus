
module.exports = {
    
    logOut: () => {
        Session.set('loggedIn', null);
        Session.set('wallet', null);
        Session.set('priv', null);
        Session.set('addr', null);
        Session.set('profile', null);

    },
    
    logIn: async (privKey) => {
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

            let profile = await MixUtil.getProfile(Session.get('addr'));
            console.log(profile);
            Session.set('profile', profile);
            console.log('my', profile);

            return true;
        } catch(e) {
            console.log(e.message);
            throw e;
        }
    
    },


}