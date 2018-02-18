import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../util/web3.service';

import FungibleAssetStore_artifacts from '../../../../build/contracts/FungibleAssetStore.json';
import FungibleAssetStoreFactory_artifacts from '../../../../build/contracts/FungibleAssetStoreFactory.json';
import Factory_artifacts from '../../../../build/contracts/Factory.json';

// TODO: Move to an util library
// let toAscii = function(str) {
//   return web3.toAscii(str).replace(/\u0000/g, '');
// }

@Component({
  selector: 'app-creator-form',
  templateUrl: './creator-form.component.html',
  styleUrls: ['./creator-form.component.css']
})
export class CreatorFormComponent implements OnInit {

  FungibleAssetStore: any;
  FungibleAssetStoreFactory: any;
  Factory: any;
  needStore: boolean = false;

  stores: any;
  selectedStore: any;

  accounts: string[];

  model = {
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
    transferTo:''
  };

  storeModel = {
    name: ''
  };

  status = '';

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
    this.web3Service.artifactsToContract(Factory_artifacts)
      .then(async (contractAbstraction) => {
        this.Factory = contractAbstraction;
    });
    // );
    // this.web3Service.artifactsToContract(simpleAssetTypeFactory_artifacts)
    //   .then(async (contractAbstraction) => {
    //     this.SimpleAssetTypeFactory = contractAbstraction;
    //     const deployedSimpleAssetTypeFactory = await this.SimpleAssetTypeFactory.deployed();

    //     let factoryRegistryAddress = await deployedSimpleAssetTypeFactory.assetTypesRegistry.call();
    //     this.status = "Registry address: "+factoryRegistryAddress;

    //   }
    // );
    // this.web3Service.artifactsToContract(assetType_artifacts)
    //   .then((contractAbstraction) => {
    //     this.AssetType = contractAbstraction;
    //     this.refreshBalance();
    //   }
    // );
    // this.web3Service.artifactsToContract(simplAssetType_artifacts)
    //   .then((contractAbstraction) => {
    //     this.SimpleAssetType = contractAbstraction;
    //   }
    // );
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      console.log("Account: "+this.model.account);
      //this.refreshBalance();
      this.loadStores();
    });
  }

  /*async loadStores2() {
    const factory = await this.FungibleAssetStoreFactory.deployed();
    let stores = await factory.getStores.call({from: this.model.account});
    console.log(stores);
  }*/
  async loadFactory() {

  }
  async loadStores() {
    let factory = await this.FungibleAssetStoreFactory.deployed();
    let numStores = await factory.getNumberStores.call({from: this.model.account});
    this.stores = [];
    //let tmp = await factory.getStores.call({from: this.model.account});
    //console.log(tmp);

    for(var i = 0; i < numStores; i++) {
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

  async refreshBalance() {

  }

  getEvent(logs, eventName) {
    let size = logs.length;
    for(let i = 0; i < size; i++) {
      if(logs[i].event == eventName){
        return logs[i];
      }
    }
  }

  setStatus(status) {
    this.status = status;
  }
  setStore(e) {
    console.log('Setting selectedStore: ' + e.target.value);
    this.model.selectedStore = e.target.value;
  }

  setAssetType(e) {
    console.log('Setting assetType: ' + e.target.value);
    this.model.assetType = e.target.value;
  }
  setTitle(e) {
    console.log('Setting title: ' + e.target.value);
    this.model.title = e.target.value;
  }
  setDescription(e) {
    console.log('Setting description: ' + e.target.value);
    this.model.description = e.target.value;
  }
  setImageUrl(e) {
    console.log('Setting imageUrl: ' + e.target.value);
    this.model.imageUrl = e.target.value;
  }
  setSupply(e) {
    console.log('Setting supply: ' + e.target.value);
    this.model.supply = e.target.value;
  }
  setPrice(e) {
    console.log('Setting price: ' + e.target.value);
    this.model.price = e.target.value;
  }
  setProperties(e) {
    console.log('Setting properties: ' + e.target.value);
    this.model.properties = e.target.value;
  }


  setStoreName(e) {
    console.log('Setting storeName: ' + e.target.value);
    this.model.storeName = e.target.value;
  }
  setStoreUrl(e) {
    console.log('Setting storeUrl: ' + e.target.value);
    this.model.storeUrl = e.target.value;
  }

  setTransferSmartContract(e) {
    console.log('Setting transferSmartContract: ' + e.target.value);
    this.model.transferSmartContract = e.target.value;
  }
  setTransferTokenId(e) {
    console.log('Setting transferTokenId: ' + e.target.value);
    this.model.transferTokenId = e.target.value;
  }
  setTransferTo(e) {
    console.log('Setting transferTo: ' + e.target.value);
    this.model.transferTo = e.target.value;
  }


  async createStore(){
    try {
      let factory = await this.FungibleAssetStoreFactory.deployed();

      let tx = await factory.createStore(this.model.storeName, this.model.storeUrl, {gas: 9000000, from:this.model.account});
      let storeCreatedEvent = this.getEvent(tx.logs, "StoreCreated");
      let storeAddress = storeCreatedEvent.args.addr;
      let storeName = storeCreatedEvent.args.name;
      this.model.selectedStore = storeAddress;
      let storeOption = {name: storeName, value: storeAddress};
      //this.stores.push(storeOption);
      //this.selectedStore = storeOption;
      this.loadStores();
      console.log(tx);
      console.log("new store address:"+storeAddress);

    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async createAsset(){
    try {
      console.log(this.model.selectedStore);
      let store = await this.FungibleAssetStore.at(this.model.selectedStore);


      let tx = await store.createAssetType(this.model.title, this.model.description, this.model.imageUrl, this.model.assetType, this.model.supply, this.model.properties, {gas: 9000000, from:this.model.account});
      let assetEvent = this.getEvent(tx.logs, "AssetTypeCreated");
      let fromTokenId = assetEvent.args.fromTokenId.toNumber();
      let toTokenId = assetEvent.args.toTokenId.toNumber();

      console.log(tx);
      console.log("fromTokenId: "+fromTokenId);
      console.log("toTokenId: "+toTokenId);
  //    console.log(storeCreatedEvent);
    //  console.log("new store address:"+storeAddress);

    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }


  async transferToken(){
    try {
      let store = await this.FungibleAssetStore.at(this.model.transferSmartContract);


      let tx = await store.transfer(this.model.transferTo, this.model.transferTokenId, {gas: 9000000, from:this.model.account});
      /*let storeCreatedEvent = this.getEvent(tx.logs, "StoreCreated");
      let storeAddress = storeCreatedEvent.args.addr;
      let storeName = storeCreatedEvent.args.name;

      let storeOption = {name: storeName, value: storeAddress};*/
      //this.stores.push(storeOption);
      //this.selectedStore = storeOption;
      //this.loadStores();
      console.log(tx);
      //console.log(storeCreatedEvent);
      //texconsole.log("new store address:"+storeAddress);

    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }


}
