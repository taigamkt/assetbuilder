import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../util/web3.service';

import FungibleAssetStore_artifacts from '../../../../build/contracts/FungibleAssetStore.json';
import FungibleAssetStoreFactory_artifacts from '../../../../build/contracts/FungibleAssetStoreFactory.json';

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

  accounts: string[];

  model = {
    storeName: '',
    storeUrl: '',
    //---------
    name: '',
    totalSupply: 0,
    description: '',
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit() {
    console.log('OnInit: ' + this.web3Service);

    // subscribe to watch account change in metamask
    this.watchAccount();

    //get Factory contract
    this.web3Service.artifactsToContract(FungibleAssetStoreFactory_artifacts)
      .then(async (contractAbstraction) => {
        this.FungibleAssetStoreFactory = contractAbstraction;
        const deployedFactory = await this.FungibleAssetStoreFactory.deployed();
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
      //this.refreshBalance();
    });
  }

  async refreshBalance() {
    //List assets created buy the selected Address
    //try {
    /*  const deployedRegistry = await this.AssetTypesRegistry.deployed();

      const assetsFromOwner = await deployedRegistry.getAssetsFromOwner.call(this.model.account);
      console.log(assetsFromOwner);
      for(let i = 0; i < assetsFromOwner.length; i++) {
        let assetContractAddress = assetsFromOwner[i];
        //console.log(assetContractAddress);

        let assetType = await this.AssetType.at(assetContractAddress);
        // let assetTypeStr = toAscii(await assetType.assetType.call());
        // console.log(assetContractAddress+" - "+assetTypeStr);
      }

      /*
      const transaction = await deployedSimpleAssetTypeFactory.createSimpleAssetType(this.model.name,this.model.totalSupply,this.model.description,
        {gas: 900000, from:this.model.account});
        console.log(transaction);
        for(let i = 0; i < transaction.logs.length; i++) {
          let value = transaction.logs[i];
          if(value.event == "SimpleAssetTypeCreated") {
            console.log("SimpleAssetTypeCreated event detected");
            this.status = "New contract created: "+value.args._contractAddress);
            console.log(value.args._contractAddress);
          }
        });
      /*if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }*/
  /*  } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }


    /*try {
      const deployedMetaCoin = await this.MetaCoin.deployed();
      const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.model.account);
      console.log('Found balance: ' + metaCoinBalance);
      this.model.balance = metaCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }*/
  }

  setStatus(status) {
    this.status = status;
  }

  setName(e) {
    console.log('Setting name: ' + e.target.value);
    this.model.name = e.target.value;
  }
  setTotalSupply(e) {
    console.log('Setting totalSupply: ' + e.target.value);
    this.model.totalSupply = e.target.value;
  }
  setDescription(e) {
    console.log('Setting description: ' + e.target.value);
    this.model.description = e.target.value;
  }

  setStoreName(e) {
    console.log('Setting storeName: ' + e.target.value);
    this.model.storeName = e.target.value;
  }
  setStoreUrl(e) {
    console.log('Setting storeUrl: ' + e.target.value);
    this.model.storeUrl = e.target.value;
  }
  async createStore(){
    try {
      const factory = await this.FungibleAssetStoreFactory.deployed();

      let tx = await factory.createStore(this.model.storeName, this.model.storeUrl, {gas: 900000, from:this.model.account});
      console.log(tx);

      /*const transaction = await deployedSimpleAssetTypeFactory.createSimpleAssetType(this.model.name,this.model.totalSupply,this.model.description,
        {gas: 900000, from:this.model.account});
        console.log(transaction);
        for(let i = 0; i < transaction.logs.length; i++) {
          let value = transaction.logs[i];
          if(value.event == "SimpleAssetTypeCreated") {
            console.log("SimpleAssetTypeCreated event detected");
            this.status = "New contract created: "+value.args._contractAddress;
            console.log(value.args._contractAddress);
            this.refreshBalance();
          }
        };*/
      /*if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }*/
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async createSimpleAssetType() {
    /*console.log("On createSimpleAssetType!");

    console.log("Asset Name: "+this.model.name);
    console.log("Total Supply: "+this.model.totalSupply);
    console.log("Description: "+this.model.description);

    this.setStatus('Registering contract... (please wait)');

    try {

      const deployedSimpleAssetTypeFactory = await this.SimpleAssetTypeFactory.deployed();

      //TODO: handle the creation of new asset
      const transaction = await deployedSimpleAssetTypeFactory.createSimpleAssetType(this.model.name,this.model.totalSupply,this.model.description,
        {gas: 900000, from:this.model.account});
        console.log(transaction);
        for(let i = 0; i < transaction.logs.length; i++) {
          let value = transaction.logs[i];
          if(value.event == "SimpleAssetTypeCreated") {
            console.log("SimpleAssetTypeCreated event detected");
            this.status = "New contract created: "+value.args._contractAddress;
            console.log(value.args._contractAddress);
            this.refreshBalance();
          }
        };
      /*if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }*/
  /*  } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
/*
    debugger;
    this.AssetFactory.registerSimpleAssetType(this.model.name,this.model.totalSupply,this.model.description, {gas: 90000*2},
      (err, res) => {
        console.log(res);
        console.log(res.transactionHash);
        debugger;
        /*web3.eth.getTransactionReceipt(res.transactionHash, (err2, res2) => {
            if (err) {
                console.log(err2);
                return;
            }
            console.log(res2);
            let address = res2.contractAddress;
            if (address) {
                console.log('Contract address: ' + address);
                // Let's test the deployed contract
                //testContract(address);
                let deployedContract = contract.at(address);
                debugger;
                //deployedContract.g.call((err3, res3) => {console.log(res3)});
            }
          });*/
    //});
  }

}
