pragma solidity ^0.4.18;

//import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './FungibleAssetStore.sol';

contract FungibleAssetStoreFactory {

  mapping (address => address[]) private storesByOwners ;

  event Debug(string _str);

  event StoreCreated(string name, string url, address owner, address addr);

  function FungibleAssetStoreFactory() public {

  }

  function createStore(string _name, string _url) public {
    FungibleAssetStore store = new FungibleAssetStore(_name, _url);
    store.transferOwnership(msg.sender);
    address storeAddress = address(store);
    storesByOwners[msg.sender].push(storeAddress);
    StoreCreated(_name, _url, msg.sender, address(storeAddress));
  }

  function getNumberStores() public view returns (uint) {
    return storesByOwners[msg.sender].length;
  }

  function getStoreAddress(uint _index) public returns (address) {
    require(_index < storesByOwners[msg.sender].length);
    return storesByOwners[msg.sender][_index];
  }

  function getStores() public returns(address[]) {
    return storesByOwners[msg.sender];
  }
}
