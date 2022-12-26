// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract proxyWallet {
    uint public lastUsed = 0;
    address public delegateWalletAddr;
    address public owner = msg.sender;

    modifier onlyOwner {
      require(msg.sender == owner);
      _;
   }

   constructor(address _delegateWalletAddr) {
       delegateWalletAddr = _delegateWalletAddr;
   }

    // For now we use a delegate function (might do a proxy layer later)
    function update_delegate(address _delegateWalletAddr) public onlyOwner {
        delegateWalletAddr = _delegateWalletAddr;
    }

    // generic function: https://fravoll.github.io/solidity-patterns/proxy_delegate.html
    fallback() external payable {
        assembly {
            let _target := sload(0)
            calldatacopy(0x0, 0x0, calldatasize())
            let result := delegatecall(gas(), _target, 0x0, calldatasize(), 0x0, 0)
            returndatacopy(0x0, 0x0, returndatasize())
            switch result case 0 {revert(0, 0)} default {return (0, returndatasize())}
        }
    }
}


