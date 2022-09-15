// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// deployed at 0x2c2145481b3BE857303D11aB3A64EEd730C37853 goerli


contract BuyMeACoffee {
    event newMemo(
        address from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    address payable owner;
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory name, string memory message) public payable {
        require(msg.value > 0, "Cannot buy coffee with 0 eth");
        memos.push(Memo(msg.sender, block.timestamp, name, message));
        emit newMemo(msg.sender, block.timestamp, name, message);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
}
