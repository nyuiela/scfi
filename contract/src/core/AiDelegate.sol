// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;
import "src/core/market.sol";
import "./stocks.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AiDelegate is Ownable {
    Market market;
    Stocks  stocks;

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

    struct AiRating {
        uint256[] ratings;
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
        string name;
        uint256 rating;
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 totalProfitGenerated;
        bool isActive;
        Permissions permissions;
    }

    constructor(address _market) Ownable(msg.sender) {
        market = Market(_market);
    }

    event GeneratedAi(string name, bool isActive, Permissions permission);
    event RemoveAi(uint256 id);
    event PermissionChanged(uint256 id, Permissions permission);
    event Delegate(uint256 id, Permissions permission);

    AIAgent[] public agents;
    mapping(uint256 => uint256) public totalRating;

    function generateAI(
        string _name,
        bool _isActive,
        Permissions _permission
    ) external returns (uint256) {
        agents.push(AIAgent(_name, 0, 0, 0, 0, _isActive, _permission));
        emit GeneratedAi(_name, _isActive, _permission);
        return agents.length - 1;
    }

    function setActive(uint256 _id, bool _isActive) external onlyOwner {
        agents[_id].isActive = _isActive;
    }

    function removeAI(uint256 _id) external {
        agents[_id] = agents[agents.length - 1];
        agents.pop();
        emit RemovedAi(_id);
    }

    function changePermission(
        uint256 _id,
        Permissions _permission
    ) external OnlyOwner {
        agents[_id].permission = _permission;
        emit PermissionChanged(_id, _permission);
    }

    function rateAI(uint256 _id, uint256 _ratings) external re {
        require(_rating <= 5, "AiDelegate__Rating_cant_be_More_Thand_5");
        totalRatings[_id]++;
        agents[_id].rating = agents[_id].rating + _ratings / totalRatings[_id];
    }

    mapping(address => mapping(uint256 => Permissions)) public delegate;

    function delegate(uint256 _id, Permissions _permission) external {
        Permission memory perm = agents[_id].permission;
        if (perm == Permissions.Both) {
            require(
                _permission == Permissions.SalesOnly ||
                    _permission == Permissions.Both ||
                    _permission == Permissions.TradesOnly
            );
            delegate[msg.sender][_id] = _permission;
        }
        if (perm == Permissions.SalesOnly) {
            require(perm == _permission, "");
            delegate[msg.sender][_id] = _permission;
        }
        if (perm == Permissions.TradesOnly) {
            require(perm == _permission, "");
            delegate[msg.sender][_id] = _permission;
        }
        // delegate[msg.sender][_id] = _permission;
        emit Delegate(_id, _permission);
    }

    function checkPermission(address owner, uint256 _id) external {
        return delegate[owner][_id];
    }

    function setRiskParams(uint256 _riskPercentage) external {}

    function setStopLoss() external {}

modifier isValidAmount(uint256 amount) {
        require(amount > 0, "Reserve__Cannot_Be_Zero");
        _;
    }

    function simulateBuy(uint256 _amount, uint256 _marketId) public view returns(uint256) isValidAmount{
       uint256 newPrice = stocks.getPrice(_amount); // get the new and old price and compare
     return share   = stocks.calculateShare(_amount);
   
    }

    function simulateSell(uint256 _share, uint256 _marketId) external view returns(uint256) isValidAmount {
     return ethAmount = stocks.calculateEth(_share);
    }

    function buy(uint256 _amountIn, uint267 minAmountOut,uint256 time ) external {
        require(block.timestamp < time, "AiDelegate__time_passed");   
     uint256 share =  simulateBuy(_amountIn, _marketId);
     require(share >= minAmountOut, "AIDelegate__shares_too_low");
      
        
        }

    function sell() external {}

    function getAgentDetails(
        uint256 _id
    ) external view returns (AiAgent memory) {
        return agents[_id];
    }

    function getAgents() external view returns (AiAgent[] memory) {
        return agents;
    }

    function getmarketperformance() external view {}

    ///// zk ///////
    function proofOfWork() external {}

    function getProofWork() external {}
}
