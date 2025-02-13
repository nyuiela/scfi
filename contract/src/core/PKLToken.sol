//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract PKLToken is ERC20, Ownable, Pausable {
    constructor() ERC20("PKLToken", "PKL") Ownable(msg.sender) {}

    function mint() external {}

    function burn() external {}
}
