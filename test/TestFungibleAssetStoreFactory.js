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

      let numberStoresBefore = await factory.getNumberStores.call({from: storeOwner});
      let tx = await factory.createStore(storeName, storeUrl, {from: storeOwner});
      let event = getEvent(tx.logs, "StoreCreated");

      let addressEvent = event.args.addr;

      let numberStoresAfter = await factory.getNumberStores.call({from: storeOwner});

      assert.equal(numberStoresAfter.toNumber() - numberStoresBefore.toNumber(),1, "Only one store should have been created");
      let found = false;
      for(i = 0; i < numberStoresAfter; i++) {
        let storeAddress = await factory.getStoreAddress.call(i,{from: storeOwner});
        if(storeAddress == addressEvent) {
          found = true;
        }
      }
      assert.equal(found, true, "Store created is not registered in the factory");
    });

    it('should create two stores via the factory and guarantee that you can only see your stores', async function() {
      let storeName = "MyStore";
      let storeUrl = "http://my.store";

      let factoryOwner = accounts[1];
      let storeOwner1 = accounts[2];
      let storeOwner2 = accounts[3];

      const factory = await FungibleAssetStoreFactory.deployed();

      let numberStoresBefore1 = await factory.getNumberStores.call({from:storeOwner1});
      let numberStoresBefore2 = await factory.getNumberStores.call({from:storeOwner2});

      let tx1 = await factory.createStore(storeName, storeUrl, {from: storeOwner1});
      let tx2 = await factory.createStore(storeName, storeUrl, {from: storeOwner2});

      let event1 = getEvent(tx1.logs, "StoreCreated");
      let event2 = getEvent(tx2.logs, "StoreCreated");

      let addressEvent1 = event1.args.addr;
      let addressEvent2 = event2.args.addr;

      let ownerEvent1 = event1.args.owner;
      let ownerEvent2 = event2.args.owner;

      assert.equal(ownerEvent1, storeOwner1, "Owner from the message is not hte same on the event");
      assert.equal(ownerEvent2, storeOwner2, "Owner from the message is not hte same on the event");

      let numberStoresAfter1 = await factory.getNumberStores.call({from: storeOwner1});
      let numberStoresAfter2 = await factory.getNumberStores.call({from: storeOwner2});

      assert.equal(numberStoresAfter1.toNumber() - numberStoresBefore1.toNumber(),1, "Only one store should have been created");
      assert.equal(numberStoresAfter2.toNumber() - numberStoresBefore2.toNumber(),1, "Only one store should have been created");

      let found1 = false;
      for(i = 0; i < numberStoresAfter1; i++) {
        let storeAddress = await factory.getStoreAddress.call(i, {from: storeOwner1});
        if(storeAddress == addressEvent1) {
          found1 = true;
        }
      }
      let found2 = false;
      for(i = 0; i < numberStoresAfter2; i++) {
        let storeAddress = await factory.getStoreAddress.call(i, {from: storeOwner2});
        if(storeAddress == addressEvent2) {
          found2 = true;
        }
      }
      assert.equal(found1, true, "Store created is not registered in the factory");
      assert.equal(found2, true, "Store created is not registered in the factory");
    });

  });
});
