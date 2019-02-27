

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
    },

    requestMixFromFaucet: (_toAddr, _captchaKey) => { return new Promise(async function(resolve,reject) {

            let data = "toAddr="+String(_toAddr)+"&captcha="+String(_captchaKey);

            const xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {

                    console.log(this.status, this.responseText);
                    let jsonResponse = JSON.parse(this.responseText);

                    if (this.status !== 200) {
                        
                        $.notify({
                            icon: 'glyphicon glyphicon-warning-sign',
                            title: '',
                            message: 'Error requesting MIX: '+jsonResponse.message,
                            target: '_blank',
                            allow_dismiss: false,
                        },{
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            },
                            type:'danger',
                            showProgressbar: false,
                            placement: {
                                from: "bottom",
                                align: "center"
                            }
                        });

                    } else {

                        $.notify({
                            icon: 'glyphicon glyphicon-warning-sign',
                            title: '',
                            message: 'Tx created successfully! Tx Hash: '+jsonResponse.txHash,
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

                    }
                    resolve(jsonResponse);
                }
            });

            xhr.open("POST", "https://faucet.doubleplus.io/getMix");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("cache-control", "no-cache");

            xhr.send(data);
  
        });
    }


}