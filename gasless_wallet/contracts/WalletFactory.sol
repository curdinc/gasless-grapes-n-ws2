// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./WalletBeacon.sol";
import "./WalletV1.sol";

contract WalletFactory {
    // store address mappings
    mapping(uint256 => address) public wallets;
    uint public count = 0;
    WalletBeacon immutable beacon;
    
    constructor(address _initalImplementation) {
        beacon = new WalletBeacon(_initalImplementation);
    }

    function createWallet() external returns(address) {
        BeaconProxy walletProxy = new BeaconProxy(address(beacon),
        "");
        //abi.encodeWithSelector(Wallet(address(0)).initialize.selector) to call initializer

        wallets[count] = address(walletProxy);
        ++count;
        return address(walletProxy);
    }

    function getWalletAddress(uint id) public view returns(address) {
        return wallets[id];
    }

    function getBeaconAddress() public view returns(address) {
        return address(beacon);
    }

    function getImplementation() public view returns(address) {
        return beacon.implementation();
    }
}