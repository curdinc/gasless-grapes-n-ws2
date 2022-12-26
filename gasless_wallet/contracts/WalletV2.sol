// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Wallet is Initializable {
    uint public lastUsed = 0;

    function initialize() external initializer {

    }
    
    function add(uint256 a, uint256 b) public returns(uint256 c) {
        c = a + b;
        lastUsed = c;
    }

    function zero() public {
        lastUsed = 0;
    }
}