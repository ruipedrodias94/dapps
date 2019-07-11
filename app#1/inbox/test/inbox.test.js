const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const web3 = new Web3(ganache.provider(), null, OPTIONS);

const {abi, evm} = require('../compile');

let accounts;
let inbox;

const initialMessage = 'Hi there!';
const updatedMessage = 'New Message!';

beforeEach(async () => {

    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    //User one of those accounts to deploy the smartcontracts
    // inbox represents what we have in the blockchain;
    inbox = await new web3.eth.Contract((abi))
    .deploy({ data : '0x' + evm.bytecode.object, arguments: [initialMessage]})
    .send({ from : accounts[0], gas : '1000000'});

    //inbox.setProvider(provider);
});

describe('Inbox starting', () => {
    it('Deploys a contract', () => {
        // Assures that the deployed smartcontract has an address;
        assert.ok(inbox.options.address);
    });

    it('Has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, initialMessage);
    });

    it('Can update value', async () => {
        await inbox.methods.setMessage(updatedMessage).send({from : accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, updatedMessage);
    });
});