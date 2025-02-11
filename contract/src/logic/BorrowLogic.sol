//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interface/IRWA.sol";

contract Borrow is Ownable, Pausable{

//    -- function addCollateral() 
// -- function borrow()
// -- function repay()
// -- getLoanDetail(uint256)
// -- calculateLoanAmount() // colateralValue .....
// -- liquidationThreshold()
// -- _lockRWA() internal...
// -- _releaseRWA() internal
// -- CalculateLPfee
// -- liquidationType1
// -- liquidationType2

uint256 nextCollateralId;
uint256 public constant LIQUIDATION_THRESHOLD = 5000; // will fix right value
uint256 public constant PRECISION = 10000;
uint256 public fee = 1000;
IRWAContract private rwa;


   enum LiquidationType {
      LIQUIDATION,
      ROLLON
   }

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


   constructor(address rwaAddr) {
      rwa = IRWAContract(address);
   }

   mapping(address => LoanDetails) private loans;
   mapping(uint256 => Collateral) private collateral;
   // bytes32[] private collateralKey;
   mapping(bytes32 => bool) private collateralKey;

   event AddedCollateral(address indexed _owner, string indexed _name);
   event Borrowed(address indexed _owner, uint256 amount);
   event Repayed(address indexed _owner, uint256 amount);
   event BurnCollateral(uint256 indexed _id);



   function addCollateral(address _owner, string calldata _name, string calldata _collateralType, uint256 _value, string calldata _uri, string calldata _proof) /* to sustain value: onlyManager or RWA contract can call */ external {
      // check if collateral exists.
      bytes32 _key = abi.encodePacked(_owner, _name, _collateralType, _uri, _proof);
      require(!collateralKey[_key], "Borrow__Already_Added_Collateral");

      collateral[nextCollateralId] = Collateral({
         name: _name,
         owner: _owner,
         collateralType: _collateralType,
         value: _value,
         uri: _uri,
         proof: _proof
      });
      collateralKey[_key] = true;
      nextCollateralId++;
   }

   function borrow(uint256 _collateralId, uint256 _amountToBorow) internal {
      Collateral storage _collateral = collateral[_collateralId];
      require(_collateral.owner == msg.sender, "Borrow__NOt_Owner");
      require(!_collateral.locked, "Borrow__Collateral_Locked");
      loans[msg.sender] = LoanDetails({
       maxValue: _collateral.value -_amountToBorow,
        borrowed:_amountToBorow,
       collateralId: _collateralId,
       lastUpdatedValue: block.timestamp

      });
      _collateral.locked = true;
      //what are we transfering? eth,usdc,wbtc,btc,what? lets keep it simple. eth. or so. idk sure


   }
   function repay() internal payable {
      LoanDetails storage _loan = loans[msg.sender];
      require(_loan.borrowed > 0 && msg.value <= _loan.borrowed, "Borrow__Value_Not_In_Range");
      _loan.borrowed -= msg.value;
      emit Repayed(msg.sender, msg.value);
   }


   function burnCollateral(uint256 _id) /* */ external {
      Collateral storage _collateral = collateral[_id];
      require(_collateral.owner == msg.sender || msg.sender == owner, "Borrow__Not_Authorized");
      require(!_collateral.locked, "Borrow__Collateral_Locked");
      delete _collateral;
   }

   function getLoanDetails(address add) external view returns (LoanDetails memory) {
      return loans[add];
   }

   function _calculateLoanAmount(uint256 _amountToBorrow) internal returns(uint256){
    // totalPoolvalue = 1000,  amountToborrow = 200 if borrow 
    
   }

   function _setLPFees(uint256 _newFee) external /**onlyOwner */{
         fee = _newFee;
   }
   
   function _liquidationThreshold() internal returns(uint256) {}
   
   function lockRWA(uint256 _id) /* calls the RWA to lock RWA */ internal {
      rwa.lockRWA(_id);
   }
   function _releaseRWA(uint256 _id) internal {
      rwa.releaseRWA(_id);
   }

   function calculateLPFee() public returns(uint256) {
    uint256 fees = fee;

   }

   receive() external payable{}




}