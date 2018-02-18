var Migrations = artifacts.require("./Migrations.sol");

var FungibleAssetStoreFactory = artifacts.require("./FungibleAssetStoreFactory.sol");


module.exports = async function(deployer, network, accounts) {
  //console.log(accounts);
  let factoryOwner = accounts[9];
  await Promise.all([
    deployer.deploy(FungibleAssetStoreFactory, {from: factoryOwner})
  ]);

  instances = await Promise.all([
    FungibleAssetStoreFactory.deployed()
  ])

  let storeFactory = instances[0];
  console.log("Factory Smart Contract Address: "+storeFactory.address);
};
