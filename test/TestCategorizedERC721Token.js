var CategorizedERC721Token = artifacts.require("CategorizedERC721Token");

contract("CategorizedERC721Token", async function(accounts) {

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

  let isEVMException = function(err) {
    return err.toString().includes('revert');
  }

  describe('CategorizedERC721Token - Create Categories', () => {
    let owner = accounts[0];

    it('will create a new category with a certain supply', async function () {
      let categorySupply = 10;
      const token = await CategorizedERC721Token.new({from: owner});

      let tx = await token.createCategory(categorySupply);

      let transferCount = countEvents(tx.logs, "Transfer");
      assert.equal(transferCount, categorySupply, "Category Supply is not correct");

      let categoryCreatedEvent = getEvent(tx.logs, "CategoryCreated");
      let categoryId = categoryCreatedEvent.args.categoryId.toNumber();
      assert.equal(categoryId, 0, "First category should have id 0");
      assert.equal(categoryCreatedEvent.args.fromTokenId.toNumber(), 0, "First tokenId should be 0");
      assert.equal(categoryCreatedEvent.args.toTokenId.toNumber(), 9, "Last tokenId for this category is not correct");

      let categorySupplyToken = await token.getCategorySupply.call(categoryId);
      assert.equal(categorySupplyToken, categorySupply, "Supply for the category inside the token is not correct");

      let tokenCategoryId = await token.getCategoryId.call(0);
      assert.equal(tokenCategoryId, categoryId, "CategoryId for token 0 is not correct");
    });

    it('will create two category with a certain supply', async function () {
      let categorySupply1 = 10;
      let categorySupply2 = 15;
      const token = await CategorizedERC721Token.new({from: owner});

      let tx1 = await token.createCategory(categorySupply1);
      let tx2 = await token.createCategory(categorySupply2);

      let transferCount = countEvents(tx2.logs, "Transfer");
      assert.equal(transferCount, categorySupply2, "Category Supply is not correct");

      let categoryCreatedEvent = getEvent(tx2.logs, "CategoryCreated");
      let categoryId = categoryCreatedEvent.args.categoryId.toNumber();
      assert.equal(categoryId, 1, "Second category should have id 1");
      assert.equal(categoryCreatedEvent.args.fromTokenId.toNumber(), 10, "First tokenId for this category is not correct");
      assert.equal(categoryCreatedEvent.args.toTokenId.toNumber(), 24, "Last tokenId for this category is not correct");

      let categorySupplyToken = await token.getCategorySupply.call(categoryId);
      assert.equal(categorySupplyToken, categorySupply2, "Supply for the category inside the token is not correct");

      let tokenCategoryId = await token.getCategoryId.call(10);
      assert.equal(tokenCategoryId, categoryId, "CategoryId for token 10 is not correct");
    });
  });

/*  describe('CategorizedERC721Token - Extend Categories', () => {
    let owner = accounts[0];
<<<<<    it('will create a new category with a certain supply', async function () {
      let categorySupply = 10;
      const token = await CategorizedERC721Token.new({from: owner});

      let tx = await token.createCategory(categorySupply);

      let transferCount = countEvents(tx.logs, "Transfer");
      assert.equal(transferCount, categorySupply, "Category Supply is not correct");

      let categoryCreatedEvent = getEvent(tx.logs, "CategoryCreated");
      let categoryId = categoryCreatedEvent.args.categoryId.toNumber();
      assert.equal(categoryId, 0, "First category should have id 0");
      assert.equal(categoryCreatedEvent.args.fromTokenId.toNumber(), 0, "First tokenId should be 0");
      assert.equal(categoryCreatedEvent.args.toTokenId.toNumber(), 9, "Last tokenId for this category is not correct");

      let categorySupplyToken = await token.getCategorySupply.call(categoryId);
      assert.equal(categorySupplyToken, categorySupply, "Supply for the category inside the token is not correct");

      let tokenCategoryId = await token.getCategoryId.call(0);
      assert.equal(tokenCategoryId, categoryId, "CategoryId for token 0 is not correct");
    });
  });*/<});
