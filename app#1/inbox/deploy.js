const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const {abi, evm} = require('./compile');

const mnemonic = 'side tongue quit angry artist belt marine diamond roast dust gap board';
const endpoint = 'https://rinkeby.infura.io/v3/be2590788c5b4521a21a8516a8b3a2b4';

const provider = new HDWalletProvider(mnemonic, endpoint);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
    .deploy({data : '0x' + evm.bytecode.object, arguments : ['Hello Portugal!']})
    .send({from : account});

    console.log('Contract deployed in, ' + result.options.address);
}

deploy();