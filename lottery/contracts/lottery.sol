pragma solidity^0.5.1;

contract Lottery{
    
    address public manager;
  
    address payable[] public players;
    
    constructor () public{
        
        // The object msg, describes who send the transaction
        // and also some details about it
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > 0.01 ether, "You need to have at least 0.01 ether and you have");
        players.push(msg.sender);
    }
    
    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }
    
    function pickWinner() public {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
    }
}