import "babel-polyfill";
import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
const bip32path = "m/44'/76'/0'/0";


// TransportU2F.create().then(transport => {
//     const eth = new Eth(transport)

// })

module.exports = {

    ledgerConnect: () => { return new Promise(async function(resolve, reject) {

            TransportU2F.create().then(transport => {
                const eth = new Eth(transport)
                console.log(eth)
                resolve(eth);
            });

        });
    }

};