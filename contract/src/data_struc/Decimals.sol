//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract FeeCalculation {
    uint256 public constant BIPS = 10_000; // 100%
    uint256 public constant fee = 10000; // shouldnt be more than 100%
    uint256 public constant liquidationThreshold = 10000; // shouldnt be below 1
    uint256 public constant precision = 10000;

    struct AssetDecimals {
        mapping(address => uint8) decimals; // Asset address → decimals (e.g., USDC=6, ETH=18)
        uint8 baseUnit; // System-wide base unit (e.g., 18 for compatibility with most DeFi)
    }
}
