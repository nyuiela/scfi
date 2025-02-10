### structure

- rwa
  - rwaLogic
- stock
  - stockLogic
    sta
- ERC20/ERC1155/ KLTokens ------ > cross

:::":":";;;;":kqw-- 20 initially
-- 10 out -- losses
-- 10 how does this ??

---- 20 shares ------ 20 KLTokens ----

### RWA

--> tokenize asset
--> value of the RWA (need to find the worth of RWA)
--> minted KLToken equivalence of RWA

### RWALOgic / borrow logic for RWA

--> collateral

- deposits minted KLToken equivalence of RWA
- value is locked

--> lending

- borrow against collateral
-

--> liquidization

- rolling method to extend loan and increase interest as incentive
- liquidization of loan...
-

### BorrowingLogic

---> addCollateral

---> executeBorrow

---> repay

---> getLoans()

### Liquidation Logic

---type1 -- rolling
--- type2 - traditional liquidation
--- threshold

### Fee logics

---> LiquidationRolling fee

---> setInterestFee() onlyOwner; // interest (lend 200, 2% interest) interestFee
200 , 2%?

KLTOken -- 1KLToken = ?

### Culculation

### withdraw, rwa

- asset 200 ---> KLToken equla 150 ---> tk 100 -- 50 worth --- 100
- 100 -- kltoken --- 50 -- 50
  kltoken -> borrow you get kltoken,
  erc20 - value; ->
  erc1155 - index1 -> 600 tokens -> (50k value)
  erc20 - 1000000 tokens.
  erc1155 - 1 - 20000000 tokens,
  2 - 50000000 token,
  3 - 500000 token.
  nft + erc20
  rwa + 2000000 tokens (50K)
  rwa2 + x tokens ( x = 50K)
  rwa + 2 token (1/2 = 25k)
  erc1155 piano -> 300 token (valuation: 500k) totalSupply -> rwa (500k)

1 -> 6000 tokens - 1/2 borrow (value \* amount)
2 -> 700 tokens - (value)

- withdraw
- klToken
- tokenize rwa worth

### ValidatorLogic // onlyowner //operator

-- validateBorrow
-- validatewithdraw // rwa-> usdc/
-- validateRepay
-- validateCollateral

I like your brain weirdddddd...youre a zombie
live share is not for this yk. you started this shh let me think 🤫

### stocks

import data from oracle network (live stocks data)
-> stocks Manager / AssetManager;

- addStocks (address & oracle of deployed stocks)
- removeStocks (remove both address and oracle for the stock)
- -> stocks reserve / value and live Market price. (buy, transfer, sell)
  -> price feeds (getL:astestFeed, )

### Buy Gold (stocks)

I have a piano -> tokenize -> erc1155 - piano + 30000 (worth: 30000 usdc)
what does the piano guy have? erc1155 (piano) balance: 30000.
lend from contract or lending Pool: erc1155 (piano) -> put into 20000 -> giving you 2000 money (klToken)
2000 money - buy gold. -> 200 shares;

-- buy the Gold -- 200 share (unique for each stock); x ? increase : decrease
buy stock => x share;

### RWA -- > tokenize

### Lending --> tokenize value as collateral ---> get money from reservePool --> buy shares from stock

### reservePool --> LP providers --- LP tokens -- deposit -- redeem

### deposit(buy)(sharefromstock) -- normal user --- stright to stock

### StockPool -- stockPool

rwa -> RWAManager -> OracleManager

### RwaContract

1. should there be a whitelist of accepted rwa? yes
2.

- addRWAType() / addRWA() onlyOwner
- removeRWAType / removeRWA() onlyOwner
- \_checkRWACompatibility()
- tokenize()
- lockRWA() params: bool lock?
- \_releaseRWA()
- \_valuation() // rwa evaluation (getting rwa value)
- getRWADetails()

### Lending

- borrow() // rwa
- repay() // loanId;
-

LendingContract == lendingLogic
reservePoolContract ==reserveLogic
StockPoolcontract == poolCreationLogic
Buy
function pruneValidatorList() external {
uint256 listCount = validatorCount;
//address[] memory proxies = new address[](stakingProxyCount);

        for (uint256 i = 0; i < proxies.length; i++) proxies[i] = stakingProxies[i];
        for (uint256 i = 0; i < listCount; i++) {
            address vali = validators[listCount - 1 - i];
            uint256[] memory rewards = new uint256[](proxies.length);
            address[] memory valis = new address[](proxies.length);
            for (uint256 j = 0; j < proxies.length; j++) {
                rewards[j] = IRoninValidator(roninStaking).getReward(vali, proxies[j]);
                valis[j] = vali;
            }
            uint256[] memory stakingTotals = IRoninValidator(roninStaking).getManyStakingAmounts(valis, proxies);
            bool canPrune = true;
            for (uint256 j = 0; j < proxies.length; j++)
                if (rewards[j] != 0 || stakingTotals[j] != 0) {
                    canPrune = false;
                    break;
                }
            if (canPrune) _removeValidator(vali);
        }
    }



    function _removeValidator(address _validator) internal {
        if (validatorStakeActive[_validator]) {
            uint256 index = validatorIndex[_validator];
            address lastValidator = validators[--validatorCount];
            validatorStakeActive[_validator] = false;
            validators[index] = lastValidator;
            [0,1,2,3,4,5]
            4
            5 = 5
            5
            0,1,2,3,4,

            validatorIndex[lastValidator] = index;
            validators.pop();
        }
    }
