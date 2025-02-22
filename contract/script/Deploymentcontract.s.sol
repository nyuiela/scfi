// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;
import{Script} from "forge-std/contracts/Scripts.sol";
import "../src/core/AiDelegate.sol";
import "../src/core/market.sol";
import "../src/core/PKLToken.sol";
import "../src/core/RWAContract.sol";
import "../src/core/stocks.sol";
import "../src/core/Treasury.sol";

contract DeploymentContract is Script{
AiDelegate Ai;
Market market;
RWAContract rwa;

 Stocks stocks;
 Treasury treasury;
 
 //address priceFeed;

   function run() public {
      deployMarket();
      deployAiDelegate();
      deployStocks(priceFeed);
   }
   // what i am seeing is messed up, like its just like the other time. let me commint so you log in from your side. sure

   function deployStocks(address priceFeed) public returns(address) {
      stocks = new Stocks(
         priceFeed
      );
      return address(stocks);
   }
   function deployAiDelegate() public returns(address) {
      // takes the market.
     return Ai = new AiDelegate(address(market));
   }

   function deployMarket() public returns(address){
   return markeet = new Market(address(stocks));
   }

}