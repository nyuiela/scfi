// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Stocks is ERC20 {
    string public name;
    string public apiLink;
    bool public isInitialized;
    uint256 public constant PRICE_PRECISION = 1e18;
    AggregatorV3Interface internal priceFeed;

    event Bought(address indexed buyer, uint256 amount);
    event Sold(address indexed seller, uint256 amount);

    constructor(address _priceFeed) ERC20("Stocks", "STCKS") {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function initialize(
        string calldata _apiLink,
        string calldata _name
    ) external {
        require(!isInitialized, "Already initialized");
        name = _name;
        apiLink = _apiLink;
        isInitialized = true;
    }

    function buy() external payable {
        require(isInitialized, "Contract not initialized");
        uint256 amount = calculateShare(msg.value);
        _mint(msg.sender, amount);
        emit Bought(msg.sender, amount);
    }

    function sell(uint256 amount) external {
        require(isInitialized, "Contract not initialized");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        uint256 ethAmount = calculateEth(amount);
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(ethAmount);
        emit Sold(msg.sender, amount);
    }

    function calculateShare(uint256 ethAmount) internal view returns (uint256) {
        uint256 price = getPrice();
        return (ethAmount * PRICE_PRECISION) / price;
    }

    function calculateEth(uint256 shareAmount) internal view returns (uint256) {
        uint256 price = getPrice();
        return (shareAmount * price) / PRICE_PRECISION;
    }

    function getPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }

    ///metadata
}
