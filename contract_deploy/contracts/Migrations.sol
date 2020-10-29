// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract getdomain{
  address _owner;

  constructor() public {
    _owner = msg.sender;
  }


  modifier onlyOwner() {
    require(msg.sender == _owner,'get out!');
    _;
  }

  event view_domain(
    string domain,
    address add,
    bool boo
  );

  function give_my_domain(string memory _domain)public payable {
    if (msg.value >= 0.01 ether){
      emit view_domain(_domain,msg.sender,true);
    }else{
      emit view_domain(_domain,msg.sender,false);
    }
  }

  function trans(address _add) public onlyOwner  {
    address(uint160(_add)).transfer(address(this).balance);
  }
}
