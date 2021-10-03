const Factory = artifacts.require('Factory');
const DummyUsdc = artifacts.require('DummyUsdc');
const License = artifacts.require('License');
const Market = artifacts.require('Market');
const catchRevert = require('../helpers/exceptions.js').catchRevert;

contract('Market', accounts => {
  it('should buy a license and transfer the fees', async () => {
    const factoryInstance = await Factory.deployed();
    const marketInstance = await Market.deployed();

    await factoryInstance.addLicenseType(
      '0x0234567800000000000000000000000000000000000000000000000000000000',
    );

    const newLicense = await factoryInstance.createLicense(
      '0x7465737400000000000000000000000000000000000000000000000000000000',
      [1],
      [1000],
      [0],
    );

    const usdcInstance = await DummyUsdc.deployed();
    await usdcInstance.airdropMe();
    await usdcInstance.approve(marketInstance.address, 1000);

    const deployedLicenseContract = newLicense.logs[0].address;

    await marketInstance.buyLicense(1, deployedLicenseContract, accounts[0]);

    const earnedFees = await usdcInstance.balanceOf(deployedLicenseContract);
    const fees = earnedFees.toString();

    assert.equal(fees, '800', 'did not receive fees');
  });
  it('should fail when trying to buy a license that does not exist', async () => {
    const factoryInstance = await Factory.deployed();
    const marketInstance = await Market.deployed();

    await factoryInstance.addLicenseType(
      '0x0234567800000000000000000000000000000000000000000000000000000000',
    );

    const newLicense = await factoryInstance.createLicense(
      '0x7465117400000000000000000000000000000000000000000000000000000000',
      [1],
      [1000],
      [0],
    );

    const usdcInstance = await DummyUsdc.deployed();
    await usdcInstance.airdropMe();
    await usdcInstance.approve(marketInstance.address, 1000);

    const deployedLicenseContract = newLicense.logs[0].address;

    await catchRevert(
      marketInstance.buyLicense(1337, deployedLicenseContract, accounts[0]),
    );
  });
});
