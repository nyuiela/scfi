// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IReserve {
    // Events
    event Deposited(address owner, uint256 amount, uint256 share);
    event Withdraw(address owner, uint256 share);
    event FeesDistributed(uint256 amount);

    // External Functions
    function deposit(uint256 _amount) external;

    function withdraw(uint256 _share) external;

    function distributeFees() external;

    function transferToken(address to, uint256 amount) external;

    // View Functions
    function minReserveDeposit() external view returns (uint256);

    function totalReserveBalance() external view returns (uint256);

    function accumulatedFees() external view returns (uint256);

    function pklToken() external view returns (IERC20);
}
