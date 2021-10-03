// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// @notice This contract is not for production, only to create a dummy USDC contract for local development
contract DummyUsdc is ERC20 {
    constructor() ERC20('USDC Coin', 'USDC') {}

    function airdropMe() external {
        // @notice mint 1000000000000000 tokens with 6 decimals
        _mint(msg.sender, 1000000000000000000000);
    }
}
