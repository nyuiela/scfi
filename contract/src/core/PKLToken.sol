//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "contract/src/logic/reserveLogic.sol";

contract PKLToken is ERC20, Ownable, Pausable {
    address reserve;
    //lp yard
    // mint mint shares
    // burns shares 
    // transfer shares
    constructor(address _reserve) ERC20("PKLToken", "PKL") Ownable(msg.sender) {
        reserve = _reserve;
    }
    event BurnShares(uint256 amount);
    event MintShares(uint256 amount, address receiver);
    
    modifier onlyReserve() {
        require(msg.sender == reserve, "PKLToken__Only_callable_By_reserve"); 
        _;
    }

    function mint(address to, uint256 amount) external onlyReserve {
        _mint(to, amount);
        emit MintShares(amount, to);
    }

    function burn(address account, uint256 amount) external onlyReserve {
        _burn(account, amount);
        emit BurnShares(account, amount);
    }

    

    function totalBalance() external view returns(uint256){
        return totalSupply();
    }

    function changeReserve(address newReserve) external onlyOwner {
        reserve = newReserve;
    }

}
