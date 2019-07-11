pragma solidity ^0.5.1;

contract Lottery{

    address public manager;
    address payable[] public players;

    constructor() public{
        manager = msg.sender;
    }
    // Modifier allow us to put a require in every modified function
    modifier restricted() {
        require(msg.sender == manager, "You should be the manager!");
        _;
    }
    // Payble allow us to send money to the contract
    function enter() public payable {
        // Like a condition
        require(msg.value > .01 ether, "Should have a minimum of 0.01 ether");
        players.push(msg.sender);
    }
    // Pseudo random
    function random() private view returns (uint) {
        return uint (keccak256((abi.encodePacked(block.difficulty, now, players))));
    }
    // Function that picks the winner
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        // Reset the players array, in order to make a new Lottery
        players = new address payable[](0);
    }
    // Get players function
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}