// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IStocks {
    // Events
    event Bought(address indexed buyer, uint256 amount);
    event Sold(address indexed seller, uint256 amount);

    // Functions
    function initialize(
        string calldata _apiLink,
        string calldata _name
    ) external;

    function buy() external payable;

    function sell(uint256 amount) external;

    function getPrice() external view returns (uint256);

    // Getters
    function name() external view returns (string memory);

    function apiLink() external view returns (string memory);

    function isInitialized() external view returns (bool);
}
