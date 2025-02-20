// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IStocks {
    // Events
    event Bought(address indexed buyer, uint256 amount);
    event Sold(address indexed seller, uint256 amount);

    // State Variables (view functions)
    function name() external view returns (string memory);

    function apiLink() external view returns (string memory);

    function isInitialized() external view returns (bool);

    function PRICE_PRECISION() external pure returns (uint256);

    // Functions
    function initialize(
        string calldata _apiLink,
        string calldata _name
    ) external;

    function buy() external payable;

    function sell(uint256 amount) external;

    function getPrice() external view returns (uint256);

    // ERC20 Functions (inherited from ERC20)
    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function calculateShare(uint256) external view returns (uint256);

    function calculateEth(uint256) external view returns (uint256);
}
