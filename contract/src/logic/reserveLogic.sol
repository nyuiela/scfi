   
   //SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/core/PKLToken.sol";
contract ReserveLogic is Ownable, Pausable{
    PKLToken token;
   
   uint256 public totalLiquidity;
   uint256 public lastInterestPeriod;
   mapping(address => uint256) publlic liquidity;

constructor(address _token){
   token = PKLToken(_token);
   lastInterestPeriod = block.timestamp;

}

modifier isValidAmount(uint256 amount){
   require(msg.value > 0, "Reserve__Cannot_Be_Zero");
   _;
}

   struct LpDataParam{
      uint256 interestRate;
      uint256 lastTimeupdated;
      uint256 lpInterestRate;

   }
   
   function deposit() external payable isValidAmount(amount) {
      amount = msg.value;
      (uint256 share) = _deposit(amount);

      
   }
   function _deposit(uint256 _amount) internal returns(uint256  klpTokensToMint) {

      if(totalLiquidity == 0){
      klpTokensToMin = _amount;
      } else{
         klpTokensToMint = calculatelpshare(_amount);
      }
      liquidity[msg.sender] += _amount;
      totalLiquidity  += _amount;
      token._mint(msg.sender,  klpTokensToMint);
      payable.transfer(msg.sender,address(this), _amount);

   }

  function _withdraw(uint256 _klpTOkens) internal returns(uint256 _amount){
    require(token.balanceOf(msg.sender) > _klpTokens);
    (_amount) = calculatelpshare(_klpTokens); 
    token.burn(_amount, msg.sender);
    payable.transfer(address(this), msg.sender, _amount);
  }
  

  function  calculatelpshare(uint256 amount) internal returns(uint256 share){
  return share  = ( amount * token.totalSupply()) /totalLiquidity ;
  }


  function  totalreservebalance() external returns(uint256 _totalBalance){
   return totalLiquidity;

  }

  function calulateAccumulatedFee() internal{}

  function calculateDistributeFee() internal{}


receive() external payable{}

}