// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IRWAContract {
    // Events
    event Tokenized(uint256 indexed _id, address indexed owner, uint256 evaluation);
    event Burnt(uint256 indexed _id, address indexed owner, uint256 _reason);
    event AddedRWAType(string name);
    event RemovedRWAType(string name);

    // State Variables
    function nextRWAtypeId() external view returns (uint256);
    function nextTokenId() external view returns (uint256);
    function idToAsset(uint256) external view returns (address owner, string memory rwaType, bytes32 details, uint256 value, bool locked);
    function rwaTypes(string memory) external view returns (bool);
    function operators(address) external view returns (bool);

    // Functions
    function tokenize(string calldata _rwatype, bytes32 _details) external returns (uint256);
    function assignLocker(uint256 _id, address assignee) external;
    function releaseRWA(uint256 _id) external;
    function lockRWA(uint256 _id) external;
    function addRWAType(string calldata _name) external;
    function removeRWAType(string calldata _name) external;
    function getRWADetails(uint256 _id) external view returns (address owner, string memory rwaType, bytes32 details, uint256 value, bool locked);
    function setOperators(address _addOperator) external;
    function removeOperator(address _removeOperator) external;
}