//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interface/IRWA.sol";
import "../interface/IReserve.sol";

contract Borrow is Ownable, Pausable {
    uint256 nextCollateralId;
    uint256 public constant LIQUIDATION_THRESHOLD = 5000; // will fix right value
    uint256 public constant PRECISION = 10000;
    uint256 public fee = 1000;
    IRWAContract private rwa;
    IReserve public reserve;
    IERC20 public pklToken;

    mapping(uint256 => bool) isUnderLiquidation;

    // enum LiquidationType {
    //     LIQUIDATION,
    //     ROLLON
    // }

    struct LoanDetails {
        // address owner;
        uint256 maxAmount;
        uint256 borrowed;
        uint256 collateralId;
        uint256 lastUpdatedValue;
        // Collateral collateral;
        // bool locked;
    }

    struct Collateral {
        string name;
        address owner;
        /* type */ string collateralType;
        uint256 value;
        string uri;
        string proof;
        bool locked;
    }

    constructor(
        address rwaAddr,
        address reserveAddress,
        address pklTokenAddress
    ) Ownable(msg.sender) {
        rwa = IRWAContract(rwaAddr);
        reserve = IReserve(reserveAddress);
        pklToken = IERC20(pklTokenAddress);
    }

    mapping(address => LoanDetails) private loans;
    mapping(uint256 => Collateral) private collateral;
    // bytes32[] private collateralKey;
    mapping(bytes32 => bool) private collateralKey;
    mapping(uint256 => uint256) public currentCollateralValue;

    event AddedCollateral(address indexed _owner, string indexed _name);
    event Borrowed(address indexed _owner, uint256 amount);
    event Repayed(address indexed _owner, uint256 amount);
    event BurnCollateral(uint256 indexed _id);
    event Liquidated(address prevOwner, address owner, uint256 collateralId);

    function addCollateral(
        address _owner,
        string calldata _name,
        string calldata _collateralType,
        uint256 _value,
        string calldata _uri,
        string
            calldata _proof /* to sustain value: onlyManager or RWA contract can call */
    ) external {
        // check if collateral exists.
        bytes32 _key = keccak256(
            abi.encodePacked(_owner, _name, _collateralType, _uri, _proof)
        );
        require(!collateralKey[_key], "Borrow__Already_Added_Collateral");

        collateral[nextCollateralId] = Collateral({
            name: _name,
            owner: _owner,
            collateralType: _collateralType,
            value: _value,
            uri: _uri,
            proof: _proof,
            locked: false
        });
        collateralKey[_key] = true;
        nextCollateralId++;
    }

    function borrow(uint256 _collateralId, uint256 _amountToBorow) internal {
        // determine value before transfering token;
        require(
            !isUnderLiquidation[_collateralId],
            "Borrow__CanNOt_Borrow_UnderLiquidation"
        );
        Collateral storage _collateral = collateral[_collateralId];
        require(_collateral.owner == msg.sender, "Borrow__NOt_Owner");
        require(!_collateral.locked, "Borrow__Collateral_Locked");
        loans[msg.sender] = LoanDetails({
            maxAmount: _collateral.value - _amountToBorow,
            borrowed: _amountToBorow,
            collateralId: _collateralId,
            lastUpdatedValue: block.timestamp
        });
        _collateral.locked = true;
        reserve.transferToken(msg.sender, _amountToBorow);
        //what are we transfering? eth,usdc,wbtc,btc,what? lets keep it simple. eth. or so. idk sure
    }

    function repay(uint256 _amount) external {
        LoanDetails storage _loan = loans[msg.sender];
        require(
            _loan.borrowed > 0 && _amount <= _loan.borrowed,
            "Borrow__Value_Not_In_Range"
        );
        _loan.borrowed -= _amount;

        //  (msg.sender, address(reserve), _amount)
        (bool success, ) = address(reserve).call{value: _amount}("");
        require(success, "Borrow__Transfer_failed");
        //   pklToken.transferFrom(msg.sender, address(reserve), msg.value);
        // unlock if user has repaid full loan amount
        emit Repayed(msg.sender, _amount);
    }

    // function burnCollateral(uint256 _id /* */) external {
    //     Collateral storage _collateral = collateral[_id];
    //     require(
    //         _collateral.owner == msg.sender || msg.sender == owner(),
    //         "Borrow__Not_Authorized"
    //     );
    //     require(!_collateral.locked, "Borrow__Collateral_Locked");
    //     delete _collateral.owner;
    // }

    function getLoanDetails(
        address add
    ) external view returns (LoanDetails memory) {
        return loans[add];
    }

    function _calculateLoanAmount(
        uint256 _amountToBorrow
    ) internal returns (uint256) {
        // totalPoolvalue = 1000,  amountToborrow = 200 if borrow
    }

    function _setLPFees(uint256 _newFee) external /**onlyOwner */ {
        fee = _newFee;
    }

    // function _liquidationThreshold() internal returns (uint256) {}

    function startLiquidation(uint256 _collateralId) external {
        // check this person healthfactor
        uint256 health = _calculateLiqudationHealthFactor(_collateralId);
        require(
            health < LIQUIDATION_THRESHOLD,
            "Borrow__Health_FActor_Not_Below_Threshold"
        );
        //   Collateral storage _collateral = collateral[_collateralId];
        liquidationType1(_collateralId); //for the sake of hackathon
        isUnderLiquidation[_collateralId] = true;
    }

    function liquidationType1(uint256 _collateralId) internal {
        // require is under liquidation
        Collateral storage _collateral = collateral[_collateralId];
        require(
            isUnderLiquidation[_collateralId],
            "Borrow__NOt_Under_Liquidation"
        );
        address prevOwner = _collateral.owner;
        _collateral.owner = address(this);
        emit Liquidated(prevOwner, address(this), _collateralId);
    }

    function _calculateLiqudationHealthFactor(
        uint256 _collateralId
    ) public view returns (uint256) {
        return
            (currentCollateralValue[_collateralId] /
                collateral[_collateralId].value) * 100;
    }

    // what happens after liquidation?  3
    // 1 . we auction your property to pay off your dept
    // 2. another can pay off your dept and take your prpety
    // 3. we allow you to buy back your stuff
    // 0.8
    // factor below 0.8 then liqudation

    function lockRWA(uint256 _id /* calls the RWA to lock RWA */) internal {
        rwa.lockRWA(_id);
    }

    function _releaseRWA(uint256 _id) internal {
        rwa.releaseRWA(_id);
    }

    function calculateLPFee() public view returns (uint256) {
        uint256 fees = fee;
        return fees;
    }

    receive() external payable {}
}
