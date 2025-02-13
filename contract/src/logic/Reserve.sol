//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../core/PKLToken.sol";

// reserve for lending>> cos i don't get it.
contract Reserve is Ownable, Pausable {
    uint256 public minReserveDeposit;
    uint256 public totalReserveBalance;
    uint256 public accumulatedFees;
    uint256 public constant FEE_PERCENTAGE = 10;
    IERC20 public pklToken;

    constructor(address pklTokenAddress) Ownable(msg.sender) {
        pklToken = IERC20(pklTokenAddress);
    }

    mapping(address => uint256) private share;

    event Deposited(address owner, uint256 amount, uint256 share);
    event Withdraw(address owner, uint256 share);
    event FeesDistributed(uint256 amount);

    function deposit(uint256 _amount) external {
        require(_amount > minReserveDeposit, "Reserve__Deposit_Not_In_Range");
        uint256 _share = calculateShare(_amount);
        share[msg.sender] += _share;
        totalReserveBalance += _amount;
        pklToken.transferFrom(msg.sender, address(this), _amount);
        emit Deposited(msg.sender, _amount, _share);
    }

    function withdraw(uint256 _share) external {
        require(share[msg.sender] >= _share, "Reserve__Share_Not_Enough");
        uint256 payout = calculatePayout(_share);
        share[msg.sender] -= _share;
        totalReserveBalance -= payout;
        //   payable(msg.sender).transfer(payout);
        pklToken.transfer(msg.sender, payout);
        emit Withdraw(msg.sender, _share);
    }

    function calculatelpshare() internal {}

    function calculateAccumulatedFee() internal {
        uint256 fee = (totalReserveBalance * FEE_PERCENTAGE) / 100;
        accumulatedFees += fee;
        totalReserveBalance -= fee;
    }

    function distributeFees() external onlyOwner {
        require(accumulatedFees > 0, "Reserve__No_Fees_To_Distribute");
        uint256 feeAmount = accumulatedFees;
        accumulatedFees = 0;
        payable(owner()).transfer(feeAmount);
        emit FeesDistributed(feeAmount);
    }

    function calculateShare(uint256 _amount) internal pure returns (uint256) {
        return _amount;
    }

    function calculatePayout(uint256 _share) internal pure returns (uint256) {
        return _share;
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
