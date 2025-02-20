// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;
import "contract/src/core/market.sol";

contract AiDelegate{
Market market;
  struct RiskSettings {
        uint256 maxTradeLimit;
        uint256 stopLossThreshold;
    }
     enum Permissions {
        None,
        TradesOnly,
        SalesOnly,
        Both
    }
    
    struct Trade {
        uint256 marketId;
        address userAddress;
        address aiAgent;
        uint256 amount;
        uint256 timestamp;
        bool isSuccessful;
        uint256 profit;
    }

    
    struct AIAgent {
        uint256 rating;
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 totalProfitGenerated;
        bool isActive;
    }
constructor(address _market){
    market = Market(_market);
}
    function generateAI() external{}
    function removeAI() external{}
     function rateAI() external{}
    function setRiskParams() external{}

    function simulateTrade() external{}

    function buy() external{}

    function sell() external{}

    function getAegentDetails() external view {}

    function getmarketperformance() external view{}

}
