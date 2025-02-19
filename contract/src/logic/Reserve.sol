//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../core/PKLToken.sol";
import "contract/src/logic/reserveLogic.sol";

// reserve for lending>> cos i don't get it.
contract Reserve is Ownable, Pausable, ReserveLogic {
    uint256 public minReserveDeposit;
    uint256 public totalReserveBalance;
    
    uint256 public constant FEE_PERCENTAGE = 10;
    IERC20 public pklToken;

    address tresuary;

    constructor(address pklTokenAddress, address _treasury) Ownable(msg.sender) {
        pklToken = IERC20(pklTokenAddress);
        treasuary = _treasury;
    }


    event Deposited(address owner, uint256 amount, uint256 share);
    event Withdraw(address owner, uint256 share);
    event FeesDistributed(uint256 amount);

    function deposit(uint256 _amount) external {
        deposit(_amount);
        // share[msg.sender] += _amount;
        emit Deposited(msg.sender, _amount, _share);
    }

    function withdraw(uint256 _klpTokens) external {
        _withdraw(_klpTokens);
  
        emit Withdraw(msg.sender, _share);
    }



    function distributeFees() external onlyOwner {
        calculateAccumulatedFee();
        require(accumulatedFees > 0, "Reserve__No_Fees_To_Distribute");
        uint256 feeAmount = accumulatedFees;
        accumulatedFees = 0;
        payable(owner()).transfer(feeAmount);
        emit FeesDistributed(feeAmount);
    }



    function transferToken(
        address to,
        uint256 amount
    ) external /* onlyBorrower*/ {
        pklToken.transfer(to, amount);
    }

    receive() external payable {
        //   deposit();
    }
}
