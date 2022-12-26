// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract addition {
    uint public lastUsed = 0;
    function add(uint256 a, uint256 b) public returns(uint256 c) {
        c = a + b;
    } 
    
    function createCD(uint a, uint b) pure external returns(bytes memory) {
        return abi.encodeWithSignature("add(uint256,uint256)", a, b);
    }

    function getLastUSED() pure external returns(bytes memory) {
        return abi.encodeWithSignature("lastUsed()");
    }
}