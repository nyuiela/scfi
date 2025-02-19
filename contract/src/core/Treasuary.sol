//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    uint256 totalBalance;


modifier validAmount(uint256 _amount){
    require(_amount >0, "Treasury__must_Be_Greater_Than_Zero");
    _;
}
    mapping(address => uint256) private deposits;
   constructor () Ownable(msg.sender) {
      
   }

    function deposit() external payable validAmount(msg.value){
      
       uint256  _amount = msg.value; // hello!, you can't do that here lol. why not? because the _amount is not even used anywhere. 
      deposits[msg.sender] += _amount;
      totalBalance += _amount;

    }
    
    function withdraw(uint256 _amount) external {
      require(deposits[msg.sender] >= _amount, "Treasury__insufficent_balance");
      deposits[msg.sender] -= _amount;
      totalBalance -= _amount;
      payable(msg.sender).transfer(_amount);
    }

    function withdrawFromTreasury(uint256 _amount, address beneficiary) external /**onlyOwner */{
      require(totalBalance >= _amount, "");
      totalBalance -= _amount;
      payable(beneficiary).transfer(_amount);
    }

    function treseauryBalance() external view returns(uint256) {
        return totalBalance;
         
    }

    receive() external payable{}
    
}