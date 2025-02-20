// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;
import "src/core/market.sol";
// import "./stocks.sol";
import "../interface/IStocks.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AiDelegate is Ownable {
    Market market;
    //  Stocks stocks;
    IStocks stocks;

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

    //  struct AiRating {
    //      uint256[] ratings;
    //  }

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
    event BuySimulation(
        uint256 _amountIn,
        uint256 minAmountOut,
        uint256 time,
        uint256 share,
        uint256 marketId
    );
    event sellsimulation(
        uint256 _share,
        uint256 minAmount,
        uint256 time,
        uint256 actualAmount,
        uint256 marketId
    );

    AIAgent[] public agents;
    mapping(uint256 => uint256) public totalRating;

    function generateAI(
        string memory _name,
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
        emit RemoveAi(_id);
    }

    function changePermission(
        uint256 _id,
        Permissions _permission
    ) external onlyOwner {
        agents[_id].permissions = _permission;
        emit PermissionChanged(_id, _permission);
    }

    function rateAI(uint256 _id, uint256 _ratings) external {
        require(_ratings <= 5, "AiDelegate__Rating_cant_be_More_Thand_5");
        totalRating[_id]++;
        agents[_id].rating = agents[_id].rating + _ratings / totalRating[_id];
    }

    mapping(address => mapping(uint256 => Permissions)) public delegate;

    function delegateAi(uint256 _id, Permissions _permission) external {
        Permissions perm = agents[_id].permissions;
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

    function checkPermission(
        address owner,
        uint256 _id
    ) external view returns (Permissions) {
        return delegate[owner][_id];
    }

    function setRiskParams(uint256 _riskPercentage) external {}

    function setStopLoss() external {}

    modifier isValidAmount(uint256 amount) {
        require(amount > 0, "Reserve__Cannot_Be_Zero");
        _;
    }

    function simulateBuy(
        uint256 _amount,
        uint256 _marketId
    ) public view isValidAmount(_amount) returns (uint256 share) {
        //  uint256 newPrice = stocks.getPrice(_amount); // get the new and old price and compare
        Market.Stocks memory currentStock = market.getMarket(_marketId);
        return
            share = IStocks(currentStock.stockContract).calculateShare(_amount);
    }

    function simulateSell(
        uint256 _share,
        uint256 _marketId
    ) external view isValidAmount(_share) returns (uint256 ethAmount) {
        Market.Stocks memory currentStock = market.getMarket(_marketId);
        return
            ethAmount = IStocks(currentStock.stockContract).calculateEth(
                _share
            );
    }

    function _buy(
        uint256 _amountIn,
        uint256 minShareOut,
        uint256 time,
        uint256 _marketId
    ) external {
        require(block.timestamp < time, "AiDelegate__time_passed");
        uint256 share = simulateBuy(_amountIn, _marketId);

        require(share >= minShareOut, "AIDelegate__shares_too_low");
        IStocks(currentStock.stockContract).buy();

        emit BuySimulation(_amountIn, minShareOut, time, share, _marketId);
        require(false, "simulated"); // q what does this do?
    }

    function sell(
        uint256 _shareIn,
        uint256 minAmountOut,
        uint256 time,
        uint256 _marketId
    ) external {
        require(block.timestamp < time, "AiDelegate__time_passed");
        uint256 ethAMountOut = simulateBuy(_shareIn, _marketId);
        require(ethAMountOut >= minAmountOut, "AIDelegate__amount_too_low");
        IStocks(currentStock.stockContract).sell(_shareIn);
        emit sellsimulation(
            _shareIn,
            minAmountOut,
            time,
            ethAMountOut,
            _marketId
        );
    }

    function getAgentDetails(
        uint256 _id
    ) external view returns (AIAgent memory) {
        return agents[_id];
    }

    function getAgents() external view returns (AIAgent[] memory) {
        return agents;
    }

    function getmarketperformance() external view {}

    ///// zk ///////
    function proofOfWork() external {}

    function getProofWork() external {}
}
