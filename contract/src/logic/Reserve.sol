//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../core/PKLToken.sol";
import "src/logic/reserveLogic.sol";

// reserve for lending>> cos i don't get it.
contract Reserve is Ownable, Pausable, ReserveLogic {
    uint256 public minReserveDeposit;
    uint256 totalReserveBalance;

    uint256 constant FEE_PERCENTAGE = 10;
    IERC20 public pklToken;

    address treasuary;

    constructor(
        address pklTokenAddress,
        address _treasury
    ) ReserveLogic(pklTokenAddress) {
        pklToken = IERC20(pklTokenAddress);
        treasuary = _treasury;
    }

    event Deposited(address owner, uint256 amount, uint256 share);
    event Withdraw(address owner, uint256 share);
    event FeesDistributed(uint256 amount);

    function deposit(uint256 _amount) external {
        uint256 _share = _deposit(_amount);
        // share[msg.sender] += _amount;
        emit Deposited(msg.sender, _amount, _share);
    }

    function withdraw(uint256 _klpTokens) external {
        uint256 _share = _withdraw(_klpTokens);
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

    receive() external payable override {
        //   deposit();
    }
}
