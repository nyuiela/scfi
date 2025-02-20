// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interface/IStocks.sol";

contract Market is Ownable {
    using Clones for address;

    address stock;

    constructor(address stocksAddress) Ownable(msg.sender) {
        stock = stocksAddress;
    }

    event MarketCreated(string name, string apiLink, address contractAddress);

    struct Stocks {
        string name;
        string apiLink;
        address stockContract;
    }
    Stocks[] public stocks;

    function createMarket(
        string calldata _name,
        string calldata _apiLink
    ) external onlyOwner {
        address newMarket = stock.clone();
        IStocks(newMarket).initialize(_name, _apiLink);
        stocks.push(Stocks(_name, _apiLink, newMarket));
        emit MarketCreated(_name, _apiLink, newMarket);
    }

    function getMarket(uint256 _id) external view returns (Stocks memory) {
        return stocks[_id];
    }

    function removeMarket(uint256 _id) external onlyOwner {
        stocks[_id] = stocks[stocks.length - 1];
        delete stocks[stocks.length - 1];
    }

    function getMarketValue() external {} // will return total sold and total bought like the market activeness

    function getValueOf() external {}
}
