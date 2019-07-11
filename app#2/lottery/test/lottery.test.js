const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const provider = ganache.provider();

const web3 = new Web3(provider, null, OPTIONS);

const {abi, evm} = require('../compile');

let accounts;
let lottery;


beforeEach(async () => {
    
    accounts = await web3.eth.getAccounts();
    lottery = await web3.eth.Contract(abi)
    .deploy({data : '0x' + evm.bytecode.object})
    .send({from : accounts[0], gas : 1000000})
});

describe('Lottery Contract', () => {
    it('Deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('Enters lottery', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });
    
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('Multiple accounts enters lottery', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });
    
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        assert.equal(3, players.length);
    });

    it('Requires the correct amout of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from : accounts[0],
                value : 0
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Only manager can call the contract pick winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from : accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error, 'This was an error boy');
        }
    });

    it('Sends money to winner and resets players array', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]); 

        await lottery.methods.pickWinner().send({
            from : accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        
        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert(difference > web3.utils.toWei('1.8', 'ether'));
        assert.equal(0, players.length);
    });
});