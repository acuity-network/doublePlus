
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
                Session.set('balance',parseFloat(res).toFixed(4));
            });

            let profile = await MixUtil.getProfile(Session.get('addr'));
            Session.set('profile', profile);

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


    },


    arrayBufferToBase64: ( buffer ) => {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }


}