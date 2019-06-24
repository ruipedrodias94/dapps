pragma solidity >=0.4.22 <0.6.0;

contract Inbox {

    string public message;

    constructor (string memory _message) public {
        message = _message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }
}