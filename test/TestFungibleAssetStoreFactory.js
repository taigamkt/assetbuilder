var FungibleAssetStoreFactory = artifacts.require("FungibleAssetStoreFactory");
var FungibleAssetStore = artifacts.require("FungibleAssetStore");

contract("FungibleAssetStoreFactory", async function(accounts) {

  let toAscii = function(str) {
    return web3.toAscii(str).replace(/\u0000/g, '');
  }

  let getEvent = function(logs, eventName) {
    let size = logs.length;
    for(i = 0; i < size; i++) {
      if(logs[i].event == eventName){
        return logs[i];
      }
    }
  }

  let countEvents = function(logs, eventName) {
    let size = logs.length;
    let count = 0;
    for(i = 0; i < size; i++) {
      if(logs[i].event == eventName){
        count++;
      }
    }
    return count;
  }

  describe('FungibleAssetStoreFactory', () => {

    it('should create a new store via the factory and verify values from the created store', async function() {
      let storeName = "MyStore";
      let storeUrl = "http://my.store";

      let factoryOwner = accounts[1];
      let storeOwner = accounts[2];

      const factory = await FungibleAssetStoreFactory.deployed();
      let tx = await factory.createStore(storeName, storeUrl, {from: storeOwner});

      let event = getEvent(tx.logs, "StoreCreated");

      let nameEvent = event.args.name;
      let urlEvent = event.args.url;
      let addressEvent = event.args.addr;

      assert.equal(nameEvent, storeName, "Store name is not correct");
      assert.equal(urlEvent, storeUrl, "Store URL is not correct");

      let store = FungibleAssetStore.at(addressEvent);

      let nameStored = await store.name.call();
      let urlStored = await store.url.call();

      assert.equal(storeName, nameStored, "Store name is not correct");
      assert.equal(storeUrl, urlStored, "Store url is not correct");

    });

    it('should create a new store via the factory and retrieve it from the stores registered in the factory', async function() {
      let storeName = "MyStore";
      let storeUrl = "http://my.store";

      let factoryOwner = accounts[1];
      let storeOwner = accounts[2];

      const factory = await FungibleAssetStoreFactory.deployed();

      let numberStoresBefore = await factory.getNumberStores.call();
      let tx = await factory.createStore(storeName, storeUrl, {from: storeOwner});
      let event = getEvent(tx.logs, "StoreCreated");

      let addressEvent = event.args.addr;

      let numberStoresAfter = await factory.getNumberStores.call();

      assert.equal(numberStoresAfter.toNumber() - numberStoresBefore.toNumber(),1, "Only one store should have been created");
      let found = false;
      for(i = 0; i < numberStoresAfter; i++) {
        let storeAddress = await factory.getStoreAddress.call(i);
        if(storeAddress == addressEvent) {
          found = true;
        }
      }
      assert.equal(found, true, "Store created is not registered in the factory");
    });
  });
});
