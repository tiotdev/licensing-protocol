const Factory = artifacts.require('Factory');
const DummyUsdc = artifacts.require('DummyUsdc');
const License = artifacts.require('License');
const Market = artifacts.require('Market');
const catchRevert = require('../helpers/exceptions.js').catchRevert;

// https://ethereum.stackexchange.com/questions/15755/simulating-the-passage-of-time-with-testrpc
const advanceBlockAtTime = time => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [time],
        id: new Date().getTime(),
      },
      (err, _) => {
        if (err) {
          return reject(err);
        }
        const newBlockHash = web3.eth.getBlock('latest').hash;

        return resolve(newBlockHash);
      },
    );
  });
};

contract('License', accounts => {
  it('should be able to claim the fees', async () => {
    const factoryInstance = await Factory.deployed();
    const marketInstance = await Market.deployed();

    await factoryInstance.addLicenseType(
      '0x0234533800000000000000000000000000000000000000000000000000000000',
    );

    const newLicense = await factoryInstance.createLicense(
      '0x0234533800000000000000000000000000000000000000000000000000000000',
      [1],
      [1000],
      [10],
    );

    const usdcInstance = await DummyUsdc.deployed();
    await usdcInstance.airdropMe();
    await usdcInstance.approve(marketInstance.address, 1000);

    const deployedLicenseContract = newLicense.logs[0].address;
    const deployedLicense = await License.at(deployedLicenseContract);

    await marketInstance.buyLicense(1, deployedLicenseContract, accounts[0]);

    await advanceBlockAtTime();

    const getOldBalance = await usdcInstance.balanceOf(accounts[0]);
    const oldBalance = getOldBalance.toString();

    const getClaimable = await deployedLicense.claimable();
    const claimable = getClaimable.toString();

    assert.equal(claimable, 800, 'claimable balance is not correct');

    await deployedLicense.claim();

    const newBalanceShouldBe = parseInt(oldBalance) + parseInt(claimable);

    const getNewBalance = await usdcInstance.balanceOf(accounts[0]);
    const newBalance = getNewBalance.toString();

    assert.equal(
      newBalance,
      newBalanceShouldBe,
      'fees did not arrive in user wallet',
    );
  });
  it('should not allow to claim twice', async () => {
    const factoryInstance = await Factory.deployed();
    const marketInstance = await Market.deployed();

    await factoryInstance.addLicenseType(
      '0x0334533800000000000000000000000000000000000000000000000000000000',
    );

    const newLicense = await factoryInstance.createLicense(
      '0x7464437400000000000000000000000000000000000000000000000000000000',
      [1],
      [1000],
      [0],
    );

    const usdcInstance = await DummyUsdc.deployed();
    await usdcInstance.airdropMe();
    await usdcInstance.approve(marketInstance.address, 1000);

    const deployedLicenseContract = newLicense.logs[0].address;
    const deployedLicense = await License.at(deployedLicenseContract);

    await marketInstance.buyLicense(1, deployedLicenseContract, accounts[0]);

    await advanceBlockAtTime();

    await deployedLicense.claim();

    await catchRevert(deployedLicense.claim());
  });
  it('should be able to claim the fees when owned partially', async () => {
    const factoryInstance = await Factory.deployed();
    const marketInstance = await Market.deployed();

    await factoryInstance.addLicenseType(
      '0x0111533800000000000000000000000000000000000000000000000000000000',
    );

    const newLicense = await factoryInstance.createLicense(
      '0x7465711100000000000000000000000000000000000000000000000000000000',
      [1],
      [1000],
      [0],
    );

    const usdcInstance = await DummyUsdc.deployed();
    await usdcInstance.airdropMe();
    await usdcInstance.approve(marketInstance.address, 1000);

    const deployedLicenseContract = newLicense.logs[0].address;
    const deployedLicense = await License.at(deployedLicenseContract);

    await deployedLicense.safeTransferFrom(
      accounts[0],
      accounts[1],
      0,
      (0.5 * Math.pow(10, 18)).toString(),
      '0x0',
    );

    await marketInstance.buyLicense(1, deployedLicenseContract, accounts[0]);

    await advanceBlockAtTime();

    const getOldBalance = await usdcInstance.balanceOf(accounts[0]);
    const oldBalance = getOldBalance.toString();

    const getClaimable = await deployedLicense.claimable();
    const claimable = getClaimable.toString();

    assert.equal(claimable, 400, 'claimable balance is not correct');

    await deployedLicense.claim();

    const newBalanceShouldBe = parseInt(oldBalance) + parseInt(claimable);

    const getNewBalance = await usdcInstance.balanceOf(accounts[0]);
    const newBalance = getNewBalance.toString();

    assert.equal(
      newBalance,
      newBalanceShouldBe,
      'fees did not arrive in user wallet',
    );
  });
});
