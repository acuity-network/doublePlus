
module.exports = {
    
    logOut: () => {
        Session.set('loggedIn', null);
        Session.set('wallet', null);
        Session.set('priv', null);
        Session.set('addr', null);
        Session.set('profile', null);
        Session.set('balance', null)

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
                Session.set('balance',parseFloat(res).toFixed(4));
            });

            let profile = await MixUtil.getProfile(Session.get('addr'));
            console.log(profile);
            Session.set('profile', profile);
            console.log('my', profile);
            //await module.exports.syncFollowingToLocalDB();
            //console.log(followingDb.find())
            return true;
        } catch(e) {
            console.log(e.message);
            throw e;
        }
    
    },

    syncFollowingToLocalDB: async() => {
        try{
            let addr = Session.get('addr');
            let following = await MixUtil.getTrustedAccounts(addr);
            for( const item of following) {
                Session.set('followingDbSyncing',true);
                
                console.log(Session.get('followingDbSyncing'));
                MixUtil.getProfile(item)
                .then(_profileId => {
                    followingDb.insert({address: item, profileId: _profileId})
                })
                .catch(e => {
                    followingDb.insert({address: item, profileId:null})
                });
                Session.set('followingDbSyncing', following[following.length-1]==item ? false: true);
                
            }

        } catch (e) {

            console.log(e);


        }


    }


}