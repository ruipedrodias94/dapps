const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
  };
//ganache.provider(), null, OPTIONS
let web3 = new Web3(ganache.provider(), null, OPTIONS);

const {abi, evm} = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {

    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    //User one of those accounts to deploy the smartcontracts
    inbox = await new web3.eth.Contract((abi))
    .deploy({ data : '0x' + evm.bytecode.object, arguments: ['Hi there!']})
    .send({ from : accounts[0], gas : '1000000'})
});

describe('Inbox starting', () => {
    it('Deploys a contract', () => {
        console.log(inbox);
       // console.log(bytecode);
    });
});