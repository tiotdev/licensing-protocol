const Factory = artifacts.require('Factory');
const Market = artifacts.require('Market');
const DummyUsdc = artifacts.require('DummyUsdc');

module.exports = async function (deployer) {
  // Ropsten USDC https://developers.circle.com/docs/usdc-on-testnet
  let usdcContract = '0x07865c6e87b9f70255377e024ace6630c1eaa37f';

  // For local testing: Start ganache and uncomment the following 2 lines
  // await deployer.deploy(DummyUsdc); // only for local testing
  // usdcContract = DummyUsdc.address;

  await deployer.deploy(Factory, usdcContract);
  const factoryInstance = await Factory.deployed();
  // Add 3 test license types
  await factoryInstance.addLicenseType(
    '0x9e274983b3c10cede8318d73b2c882aa04a75ebc8bf6881c52c9c0aed7388c10', // https://ipfs.io/ipfs/QmYz1sWA3pnJEq989qpQwD9erYuqbtXofeRmkRFr1Fc3vo
  );
  await factoryInstance.addLicenseType(
    '0x40e80cf6907754e72add3f1e6296e2754cb02396653215d16ddb27d4f2036a0e', // https://ipfs.io/ipfs/QmSi22df24VJERXLuVHqSZwf3QyeoVyE2Gjsgxuw26Kf33
  );
  await factoryInstance.addLicenseType(
    '0xbb06eee1f3a7ad9fa627ac1195aec6f1f32abf63e63b2cb3450227e5870c3091', // https://ipfs.io/ipfs/Qmavj5dnvPU9EpYg3iHV2DFpNHr3JLfYK319qjeeNzzHXn
  );
  await deployer.deploy(Market, Factory.address, usdcContract);
};
