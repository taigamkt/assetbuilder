import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import FungibleAssetStore_artifacts from '../../../../build/contracts/FungibleAssetStore.json';
import FungibleAssetStoreFactory_artifacts from '../../../../build/contracts/FungibleAssetStoreFactory.json';

@Component({
  selector: 'app-creator-form',
  templateUrl: './creator-form.component.html',
  styleUrls: ['./creator-form.component.css']
})
export class CreatorFormComponent implements OnInit {
  private FungibleAssetStore: any;
  private FungibleAssetStoreFactory: any;
  public needStore: boolean = false;
  public stores: any;
  public selectedStore: any;
  public accounts: string[];

  public model = {
    storeName: '',
    storeUrl: '',
    selectedStore: '',
    //---------
    assetType: '',
    title: '',
    description: '',
    imageUrl: '',
    supply: 0,
    price: 0,
    properties: '',
    account: '',
    //-----
    transferSmartContract: '',
    transferTokenId: '',
    transferTo: ''
  };

  public status = '';

  constructor(private web3Service: Web3Service) {
  }

  ngOnInit() {
    this.stores = [];
    this.selectedStore = '';
    // subscribe to watch account change in metamask
    this.watchAccount();

    //get Factory contract
    this.web3Service.artifactsToContract(FungibleAssetStoreFactory_artifacts)
      .then(async (contractAbstraction) => {
        this.FungibleAssetStoreFactory = contractAbstraction;
        this.watchAccount();
      });
    this.web3Service.artifactsToContract(FungibleAssetStore_artifacts)
      .then(async (contractAbstraction) => {
        this.FungibleAssetStore = contractAbstraction;
      });
  }

  /**
   * Watch account function
   */
  public watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      console.log("Account: " + this.model.account);
      //this.refreshBalance();
      this.loadStores();
    });
  }

  /**
   * Load stores function
   *
   * @return {Promise<void>}
   */
  public async loadStores() {
    let factory = await this.FungibleAssetStoreFactory.deployed();
    let numStores = await factory.getNumberStores.call({from: this.model.account});
    this.stores = [];
    //let tmp = await factory.getStores.call({from: this.model.account});
    //console.log(tmp);

    for (let i = 0; i < numStores; i++) {
      let storeAddr = await factory.getStoreAddress.call(i, {from: this.model.account});
      let store = await this.FungibleAssetStore.at(storeAddr);
      let storeName = await store.name.call({from: this.model.account});
      /*    console.log("store addr:"+storeAddr+" - "+i);
          console.log("store name:"+storeName+" - "+i);
    */
      this.stores.push({name: storeName, value: storeAddr});
    }
    //console.log(this.stores);
  }

  /**
   * Refresh balance
   *
   * @return {Promise<void>}
   */
  public async refreshBalance() {

  }

  /**
   * Get event function
   *
   * @param logs
   * @param eventName
   * @return {any}
   */
  public getEvent(logs, eventName) {
    let size = logs.length;
    for (let i = 0; i < size; i++) {
      if (logs[i].event == eventName) {
        return logs[i];
      }
    }
  }

  /**
   * Set status function
   *
   * @param status
   */
  public setStatus(status) {
    this.status = status;
  }

  /**
   * Set store function
   *
   * @param e
   */
  public setStore(e) {
    console.log('Setting selectedStore: ' + e.target.value);
    this.model.selectedStore = e.target.value;
  }

  /**
   * Set asset type function
   *
   * @param e
   */
  public setAssetType(e) {
    console.log('Setting assetType: ' + e.target.value);
    this.model.assetType = e.target.value;
  }

  /**
   * Set title function
   *
   * @param e
   */
  public setTitle(e) {
    console.log('Setting title: ' + e.target.value);
    this.model.title = e.target.value;
  }

  /**
   * Set description function
   *
   * @param e
   */
  public setDescription(e) {
    console.log('Setting description: ' + e.target.value);
    this.model.description = e.target.value;
  }

  /**
   * Set image function
   *
   * @param e
   */
  public setImageUrl(e) {
    console.log('Setting imageUrl: ' + e.target.value);
    this.model.imageUrl = e.target.value;
  }

  /**
   * Set supply function
   *
   * @param e
   */
  public setSupply(e) {
    console.log('Setting supply: ' + e.target.value);
    this.model.supply = e.target.value;
  }

  /**
   * Set price function
   *
   * @param e
   */
  public setPrice(e) {
    console.log('Setting price: ' + e.target.value);
    this.model.price = e.target.value;
  }

  /**
   * Set properties function
   *
   * @param e
   */
  public setProperties(e) {
    console.log('Setting properties: ' + e.target.value);
    this.model.properties = e.target.value;
  }

  /**
   * Set store name function
   *
   * @param e
   */
  public setStoreName(e) {
    console.log('Setting storeName: ' + e.target.value);
    this.model.storeName = e.target.value;
  }

  /**
   * Set store url function
   *
   * @param e
   */
  public setStoreUrl(e) {
    console.log('Setting storeUrl: ' + e.target.value);
    this.model.storeUrl = e.target.value;
  }

  /**
   * Set transfer smart contract function
   *
   * @param e
   */
  public setTransferSmartContract(e) {
    console.log('Setting transferSmartContract: ' + e.target.value);
    this.model.transferSmartContract = e.target.value;
  }

  /**
   * Set transfer token id function
   *
   * @param e
   */
  public setTransferTokenId(e) {
    console.log('Setting transferTokenId: ' + e.target.value);
    this.model.transferTokenId = e.target.value;
  }

  /**
   * Set transfer to
   *
   * @param e
   */
  public setTransferTo(e) {
    console.log('Setting transferTo: ' + e.target.value);
    this.model.transferTo = e.target.value;
  }

  /**
   * Create store function
   *
   * @return {Promise<void>}
   */
  public async createStore() {
    try {
      let factory = await this.FungibleAssetStoreFactory.deployed();
      let tx = await factory.createStore(this.model.storeName, this.model.storeUrl, {
        gas: 9000000,
        from: this.model.account
      });
      let storeCreatedEvent = this.getEvent(tx.logs, "StoreCreated");
      let storeAddress = storeCreatedEvent.args.addr;
      let storeName = storeCreatedEvent.args.name;
      this.model.selectedStore = storeAddress;
      let storeOption = {name: storeName, value: storeAddress};
      //this.stores.push(storeOption);
      //this.selectedStore = storeOption;
      this.loadStores();
      console.log(tx);
      console.log("new store address:" + storeAddress);
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  /**
   * Set create asset function
   *
   * @return {Promise<void>}
   */
  public async createAsset() {
    try {
      console.log(this.model.selectedStore);
      let store = await this.FungibleAssetStore.at(this.model.selectedStore);
      let tx = await store.createAssetType(this.model.title, this.model.description, this.model.imageUrl, this.model.assetType, this.model.supply, this.model.properties, {
        gas: 9000000,
        from: this.model.account
      });
      let assetEvent = this.getEvent(tx.logs, "AssetTypeCreated");
      let fromTokenId = assetEvent.args.fromTokenId.toNumber();
      let toTokenId = assetEvent.args.toTokenId.toNumber();
      console.log(tx);
      console.log("fromTokenId: " + fromTokenId);
      console.log("toTokenId: " + toTokenId);
      //    console.log(storeCreatedEvent);
      //  console.log("new store address:"+storeAddress);

    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  /**
   * Set transfer token function
   *
   * @return {Promise<void>}
   */
  public async transferToken() {
    try {
      let store = await this.FungibleAssetStore.at(this.model.transferSmartContract);
      let tx = await store.transfer(this.model.transferTo, this.model.transferTokenId, {
        gas: 9000000,
        from: this.model.account
      });
      console.log(tx);
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }
}
