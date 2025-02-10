//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/token/ERC1155.sol";


contract RWAContract is ERC1155 {

uint256 nextRWAtypeId;
uint256 nextTokenId;
   constructor() {}

   struct RWAStruct {
      address owner;
      string rwaType;
      bytes32 details;
      uint256 value;
      bool locked;
   }
mapping(uint256 =>  RWAStruct) public idToAsset; // comeupwithbetternaming: do it now!!!!!!
   struct RWAType{
    string name;
    bool isTypeAccepted;
   }
   mapping(uint256 =>  RWAType) public rwaTypes;
   RWAStruct[] private rwa;
   
   // RWAType[] public rwaType;
   

   event Tokenized(uint256 indexed _id, address indexed owner, uint256 evaluation);
   event Burnt(uint256 indexed _id, address indexed owner, uint256 _reason);
   event AddedRWAType(string name, uint256 typeId);
   event RemovedRWAType(string name);
   
   modifier tokenAlreadyAdded(uint256 _id){ /// check if asset is already tokenized
    require(idToAsset[_id].owner != address(0)), "RWAContract__AlreadyExist"
    _;
   }
   function tokenize(string calldata _rwatype, bytes32 _details, ) external   /*tokenAlreadyAdded( _id)*/ returns(uint256) {
      // valuation needs to be able to interact with oracle to get value of asset/rwa.
     require(_checkRWACompatibility(_rwatype), "RWAContract__Asset_Not_Compatible");
      // rwa has already being added.?? yes? good ? no? bad
      uint256 value = _valuation(); // get oracle value for rwa. 
      _mint(value, msg.sender);
      RWAStruct newRWA = RWAStruct({
         owner: msg.sender,
         rwaType: _rwaType,
         details: _details,
         value: value,
         locked: false
      });
      rwa.push()

      nextTokenId++;
      return nextTokenId - 1;
   }
   function lockRWA() external {

   }


 function addRWAType(string calldata _name, bool _isTypeAccepted) external /*onlyOwner*/{
    //rwaType
    uint256 typeId = nextRWAtypeId++;
    rwaTypes[typeId] = RWAType({
      name: _name,
      isTypeAccepted: _isTypeAccepted
    });
    emit AddedRWAType(_name,  typeId);
 }

  function removeRWAType(uint256 _id) external /* onlyOwner */ {
   delete rwaType[_id];
   emit RemovedRWAType(_name);
  }
  function _checkRWACompatibility(string calldata rwaType) internal view returns(bool) {
     RWAType memory rwaType =  rwaType[rwaType];
     return rwaType.isTypeAccepted;
  }
//   function tokenize() external{}
  
  function _releaseRWA() external{}
  function _valuation() public returns(uint256) {} // rwa evaluation (getting rwa value)
  function getRWADetails(uint256 _id) external returns (RWAStruct memory){
   return rwa[_id];
  }
// user ---- tokenize ---locks if this person wants to agsint the rwa , lock  tokenize as collateral 

}