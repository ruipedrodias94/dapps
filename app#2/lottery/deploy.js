const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const path = require('path');
const fs = require('fs-extra');

const mnemonic = 'side tongue quit angry artist belt marine diamond roast dust gap board';
const endpoint = 'https://rinkeby.infura.io/v3/be2590788c5b4521a21a8516a8b3a2b4';

const provider = new HDWalletProvider(mnemonic, endpoint);

const web3 = new Web3(provider);

const contractPath = path.resolve(__dirname, 'build', 'lottery.json');
const source = fs.readFileSync(contractPath, 'utf8');

const contract = JSON.parse(source);
let abi = '';
let bytecode = '';

for (let contractName in contract) {
    abi = contract[contractName].abi;
    bytecode = contract[contractName].evm.bytecode;
}

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + bytecode.object })
        .send({ from: account });

    console.log(abi);
    console.log('Contract deployed in, ' + result.options.address);
}

deploy();