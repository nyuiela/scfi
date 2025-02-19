//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../core/PKLToken.sol";

contract ReserveLogic is Ownable, Pausable {
    PKLToken token;

    uint256 public totalLiquidity;
    uint256 public lastInterestPeriod;
    uint256 public accumulatedFees;
    mapping(address => uint256) public liquidity;
    
    mapping(address => uint256) private share;

    constructor(address _token) Ownable(msg.sender) {
        token = PKLToken(_token);
        lastInterestPeriod = block.timestamp;
    }

    modifier isValidAmount(uint256 amount) {
        require(msg.value > 0, "Reserve__Cannot_Be_Zero");
        _;
    }

    struct LpDataParam {
        uint256 interestRate;
        uint256 lastTimeupdated;
        uint256 lpInterestRate;
    }

    function deposit(uint256 _amount) external payable isValidAmount(_amount) {
        _amount = msg.value;
        uint256 _share = _deposit(_amount);
    }

    function _deposit(
        uint256 _amount
    ) internal returns (uint256 klpTokensToMint) {
        if (totalLiquidity == 0) {
            klpTokensToMint = _amount;
        } else {
            klpTokensToMint = calculatelpshare(_amount);
        }
        liquidity[msg.sender] += _amount;
        totalLiquidity += _amount;
        share[msg.sender] += klpTokensToMint;
        token.mint(msg.sender, klpTokensToMint);
     //   token.mint(msg.sender, klpTokensToMint);
        //   payable(msg.sender).transfer(msg.sender, address(this), _amount); // logic needs to be chcked
    }

    function _withdraw(uint256 _klpTokens) internal returns (uint256 _amount) {
        require(token.balanceOf(msg.sender) > _klpTokens);
        (_amount) = calculatelpshare(_klpTokens);
        token.burn(_amount, msg.sender);
        share[msg.sender] -= _klpTokens; // underflow.
        //   payable(msg.sender).transfer(address(this), msg.sender, _amount); // logic needs to be checked
    }

    function calculatelpshare(uint256 amount) internal returns (uint256 _share) {
        return _share = (amount * token.totalSupply()) / totalLiquidity;
    }

    function totalreservebalance() external returns (uint256 _totalBalance) {
        return totalLiquidity;
    }

    function calulateAccumulatedFee() internal {}
      function calculateAccumulatedFee() internal  returns(uint256){
        uint256 fee = (totalReserveBalance * FEE_PERCENTAGE) / 100;
        accumulatedFees += fee;
        totalReserveBalance -= fee;
    }

    function calculateDistributeFee() internal {}

    receive() external payable {}
}
