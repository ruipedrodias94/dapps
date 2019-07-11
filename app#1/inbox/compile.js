
// imports & defines

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const contractPath = path.resolve(__dirname, 'contracts','inbox.sol');
const source = fs.readFileSync(contractPath, 'utf8');

let jsonContractSource = JSON.stringify({
    language: 'Solidity',
    sources: {
      'Inbox': {
          content: source,
       },
    },
    settings: { 
        outputSelection: {
            '*': {
                '*': ['abi',"evm.bytecode"],   
             // here point out the output of the compiled result
            },
        },
    },
});


module.exports = JSON.parse(solc.compile(jsonContractSource)).contracts.Inbox.Inbox;