//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library DataTypes {

// supported asset type
enum ASSETTYPE {
   STOCK
}

enum LoanStatus { ACTIVE, REPAID, LIQUIDATED }
// enum PoolType { SINGLE, MULTI } 

enum AssetTyptionStatus {PENDING, VERIFIED, REJECTED}
enum ListingStatus {ACTIVE, SOLD, CANCELLED }
enum AssetType { ERC20, ERC1155, RWA }
enum VerificationStatus { PENDING, VERIFIED, REJECTED}
enum LiquidationType { LIQUIDATION, ROLLING}
// each asset will have an address
struct Asset {
   bytes32 id;
   string name;
   uint256 decimals;
   AssetType assetType;
   VerificationStatus status;
   uint256 liquidationThreshold;
   address assetAddress;
   bool isActive; //admin can lock asset
   uint256 available;
   uint256 assetType;
   address assetAddr;
   uint256 totalSupply;
   address shareAddr;
   bytes[] apiEndpoint;
   //
}

struct PoolParam{
   
    Asset asset;
    Pool pool;
    uint256 totalLiquidity;
    uint256 feeRate;
}

// assetManager -> adds asset with Address -> Asset{}
// to prevent duplication of assets, 
struct Borrow {
   bytes32 id;
   address borrower;
   uint256 amount;
   uint256 collateralAmount;
   uint256 interestRate;
   bytes32 collateralId;
   bool status
}
//GRACEPERIOD

struct BorrowParam {
   address asset;
   address user;
   uint256 amount;
   InterestRate rate;
   bytes32 collateralId; 
   bool releaseCollateral;
}

struct InterestRate{
    uint256 fee;
}

struct RepayParam{
    uint256 amount;
    address asset;
    InterestRate fee;
}


struct Collateral {
   bytes32 id;
   uint256 liquidationThreshold;
   uint256 ltv;
   uint256 amount;
   bool locked;
}
//share will be erc20 -> address 
//mapping(address -> balance)

//for assetType 
struct AssetStruct {
   Asset asset;
   uint256 shareId;
   address[] user;
}

// borrow->collateralStruct


struct Pool {
   bytes32 id;
   
}

struct Depositparam{
    address user,
    Asset asset;
    uint256 amount;
    InterestRate fees;
    uint256 sharesBought; 
}

struct AssetShares {
    uint256 totalshares;
    uint256 avaliableshares;
}

struct WithdrawParams{
    uint266 amount;
    address asset;
    InterestRate fee;

}

struct Reputation{
    address user;
    uint256 score;
    uint256 lastUpdated;
}

struct RWA {
   bytes32 id;
   address owner;
   uint256 valuation;
   VerificationStatus status;
   bytes32 proofHash;
}

}
