//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract RWAContract is ERC1155, Ownable, Pausable {
    uint256 public nextRWAtypeId;
    uint256 public nextTokenId;

    constructor(string memory _uri) ERC1155(_uri) Ownable(msg.sender) {}

    struct RWAStruct {
        address owner;
        string rwaType;
        bytes32 details;
        uint256 value;
        bool locked;
    }
    mapping(uint256 => RWAStruct) public idToAsset; // comeupwithbetternaming: do it now!!!!!!
    struct RWAType {
        string name;
        bool isTypeAccepted;
    }
    //  mapping(uint256 => RWAType) public rwaTypes;
    mapping(string => bool) public rwaTypes;
    RWAStruct[] private rwa;

    // RWAType[] public rwaType;

    event Tokenized(
        uint256 indexed _id,
        address indexed owner,
        uint256 evaluation
    );
    event Burnt(uint256 indexed _id, address indexed owner, uint256 _reason);
    event AddedRWAType(string name);
    event RemovedRWAType(string name);

    modifier tokenAlreadyAdded(uint256 _id) {
        /// check if asset is already tokenized
        require(
            idToAsset[_id].owner != address(0),
            "RWAContract__AlreadyExist"
        );
        _;
    }

    function tokenize(
        string calldata _rwatype,
        bytes32 _details /*tokenAlreadyAdded( _id)*/
    ) external whenNotPaused returns (uint256) {
        // valuation needs to be able to interact with oracle to get value of asset/rwa.
        require(
            _checkRWACompatibility(_rwatype),
            "RWAContract__Asset_Not_Compatible"
        );
        // rwa has already being added.?? yes? good ? no? bad
        uint256 value = _valuation(); // get oracle value for rwa.
        _mint(msg.sender, nextTokenId, value, "");
        RWAStruct memory newRWA = RWAStruct({
            owner: msg.sender,
            rwaType: _rwatype,
            details: _details,
            value: value, // 4000
            locked: false
        });
        locker[nextTokenId] = msg.sender;
        rwa.push(newRWA);
        nextTokenId++;
        return nextTokenId - 1;
    }

    mapping(uint256 => address) private locker;

    function lockRWA(uint256 _id) internal {
        require(locker[_id] == msg.sender, "");
        RWAStruct storage crwa = rwa[_id];
        crwa.locked = true;
    }

    function assignLocker(uint256 _id, address assignee) external {
        require(locker[_id] == msg.sender, "");
        RWAStruct storage crwa = rwa[_id];
        require(
            operators[assignee] || crwa.owner == assignee,
            "RWAContract__Not_Autorized_to_lock"
        );
        locker[_id] = assignee;
    }

    function _releaseRWA(uint256 _id) external /**onlyOwner - not quite*/ {
        require(locker[_id] == msg.sender, "");
        RWAStruct storage crwa = rwa[_id];
        crwa.locked = false;
    }

    function addRWAType(
        string calldata _name //   bool _isTypeAccepted
    ) external /*onlyOwner*/ {
        //rwaType
        //   uint256 typeId = nextRWAtypeId++;
        // CAR => true;
        // house => false;
        rwaTypes[_name] = true;
        emit AddedRWAType(_name);
    }

    function removeRWAType(string calldata _name) external /* onlyOwner */ {
        rwaTypes[_name] = false;
        delete rwaTypes[_name];
        emit RemovedRWAType(_name);
    }

    function _checkRWACompatibility(
        string calldata _name
    ) internal view returns (bool) {
        return rwaTypes[_name];
    }

    //   function tokenize() external{}

    function _valuation() public returns (uint256) {} // rwa evaluation (getting rwa value)

    //type
    function getRWADetails(
        uint256 _id
    ) external view returns (RWAStruct memory) {
        return rwa[_id];
    }

    // user ---- tokenize ---locks if this person wants to agsint the rwa , lock  tokenize as collateral
    //  address[] operators;
    mapping(address => bool) public operators;
    address[] public operatorss; //

    function setOperators(address _addOperator) external onlyOwner {
        require(
            !operators[_addOperator],
            "RWAcontract__Operator_Address_Exist"
        );
        operators[_addOperator] = true;
    }

    function removeOperator(address _removeOperator) external onlyOwner {
        //   for (uint256 i = 0; i < operators.length; i++) {
        //       if (operators[i] == _removeOperator) {
        //           delete operators[i];
        //       }
        //   }
        operators[_removeOperator] = false;
    }
}
