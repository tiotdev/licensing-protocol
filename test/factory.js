const Factory = artifacts.require('Factory');
const License = artifacts.require('License');
const catchRevert = require('../helpers/exceptions.js').catchRevert;

contract('Factory', accounts => {
  it('should fail when trying to create a license with an invalid licenseType', async () => {
    const factoryInstance = await Factory.deployed();

    await catchRevert(
      factoryInstance.createLicense(
        '0x7465737400000000000000000000000000000000000000000000000000000000',
        [9999],
        [1000],
        [0],
      ),
    );
  });
  it('should create new license types', async () => {
    const factoryInstance = await Factory.deployed();

    await factoryInstance.addLicenseType(
      '0x0234567800000000000000000000000000000000000000000000000000000000',
    );
    await factoryInstance.addLicenseType(
      '0x1234567800000000000000000000000000000000000000000000000000000000',
    );
    await factoryInstance.addLicenseType(
      '0x2234567800000000000000000000000000000000000000000000000000000000',
    );
    await factoryInstance.addLicenseType(
      '0x3234567800000000000000000000000000000000000000000000000000000000',
    );
    await factoryInstance.addLicenseType(
      '0x4234567800000000000000000000000000000000000000000000000000000000',
    );
    await factoryInstance.addLicenseType(
      '0x5234567800000000000000000000000000000000000000000000000000000000',
    );

    const getAvailableLicenseTypesLength =
      await factoryInstance.availableLicenseTypesLength.call();
    const availableLicenseTypesLength =
      getAvailableLicenseTypesLength.toString();

    assert.notEqual(
      availableLicenseTypesLength,
      '0',
      'did not add new license types',
    );
  });
  it('should fail when trying to create a license with different licenses and price length', async () => {
    const factoryInstance = await Factory.deployed();

    await catchRevert(
      factoryInstance.createLicense(
        '0x7465737400000000000000000000000000000000000000000000000000000000',
        [1, 2, 3],
        [1000],
        [0],
      ),
    );
  });
  it('should create a license and mint tokens to caller', async () => {
    const factoryInstance = await Factory.deployed();
    const newLicense = await factoryInstance.createLicense(
      '0x7465737400000000000000000000000000000000000000000000000000000000',
      [1],
      [1000],
      [0],
    );

    const deployedLicenseContract = newLicense.logs[0].address;

    const deployedLicense = await License.at(deployedLicenseContract);

    const getBalance = await deployedLicense.balanceOf.call(accounts[0], 0);
    const balance = getBalance.toString();

    assert.equal(balance, 1000000000000000000, 'did not add a license');
  });
  it('caller should be license owner', async () => {
    const factoryInstance = await Factory.deployed();
    const newLicense = await factoryInstance.createLicense(
      '0x8365737400000000000000000000000000000000000000000000000000000000',
      [1],
      [1000],
      [0],
    );

    const deployedLicenseContract = newLicense.logs[0].address;

    const deployedLicense = await License.at(deployedLicenseContract);

    const licenseOwner = await deployedLicense.owner.call();

    assert.equal(accounts[0], licenseOwner, 'caller is not license owner');
  });
  it('should fail when trying to create a license with an existing hash', async () => {
    const factoryInstance = await Factory.deployed();

    await catchRevert(
      factoryInstance.createLicense(
        '0x7465737400000000000000000000000000000000000000000000000000000000',
        [1],
        [1000],
        [0],
      ),
    );
  });
  it('should get the correct price', async () => {
    const factoryInstance = await Factory.deployed();
    const newLicense = await factoryInstance.createLicense(
      '0x7465731100000000000000000000000000000000000000000000000000000000',
      [1, 3, 5],
      [1000, 1337, 900000],
      [0, 0, 0],
    );

    const deployedLicenseContract = newLicense.logs[0].address;

    const deployedLicense = await License.at(deployedLicenseContract);

    const getPrice = await deployedLicense.licenseTypeToPrice.call(3);
    const price = getPrice.toString();

    assert.equal(price, '1337', 'wrong price');
  });
});
