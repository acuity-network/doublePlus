import { Meteor } from 'meteor/meteor';

import React from 'react';
import ReactDOM from 'react-dom';
import '../../startup/client/lib/stylesheets/w3.css';
import '../../startup/client/lib/stylesheets/w3-theme-blue-grey.css';
import '../../startup/client/lib/stylesheets/css.css';
import '../../startup/client/lib/stylesheets/font-awesome.min.css';
import '../../startup/client/lib/stylesheets/bootstrap.css';
import '../../startup/client/lib/stylesheets/main.css';

global.Web3Util = require('./lib/web3Util.js');
global.SessionUtil = require('./lib/sessionUtil.js');
global.EthWallet = require('ethereumjs-wallet');
global.EthTx = require('ethereumjs-tx');
global.MixUtil = require('./lib/mixUtil.js');
global.IpfsUtil = require('./lib/ipfsUtil.js');

import MainLayout from '../../ui/containers/MainLayout.jsx';


Meteor.startup(() => {
  ReactDOM.render(
    
    <MainLayout />,
    document.getElementById('app')
  );
});
