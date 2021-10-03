// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.0;

interface ILicense {
    function initialize(
        bytes32 _ipfsHash,
        uint256[] calldata _licenseTypes,
        uint256[] calldata _licensePrices,
        uint256[] calldata _licenseSupply,
        address sender,
        address _USDC
    ) external;
}
