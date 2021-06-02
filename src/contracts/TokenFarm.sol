pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

/**
 * The TokenFarm contract does this and that...
 */
contract TokenFarm {

	//All code goes here
	string public name = "Dapp Token Farm";
	address public owner;
	DappToken public dappToken;
	DaiToken public daiToken;

	address[] public stakers; 
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking;

  constructor(DappToken _dappToken, DaiToken _daiToken) public {

  	dappToken = _dappToken;
  	daiToken = _daiToken;
  	owner = msg.sender;
  	
  }

  //1. Stake tokens(Deposite)
  function stakeTokens(uint _amount) public {

  	//require amount to be more than 0
  	require(_amount > 0, 'transection cant be 0');

  	//Transfer Mock Dai tokens to this contract 
  	daiToken.transferFrom(msg.sender, address(this), _amount);

  	//Update Staking balance
  	stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

  	//Add users to stake array if and only if they havent stake already
  	if(!hasStaked[msg.sender]){

  		stakers.push(msg.sender);

  	}


  	//Update staking status
  	isStaking[msg.sender] = true;
  	hasStaked[msg.sender] = true;



  }

 function unstakeTokens() public {

 	//Fetch Staking balance
 	uint balance = stakingBalance[msg.sender];

 	//Require amount greater than 0
 	require(balance > 0, 'balance can not be 0');

 	//Tranfer mock dai token for this contract for staking
 	daiToken.transfer(msg.sender, balance);

 	//Reset the staking balance to 0
 	stakingBalance[msg.sender] = 0;

 	//update the staking status
 	isStaking[msg.sender] = false;

 } 

  //Issueing tokens
 function issueToken () public {
 	//only owner can call this function
 	require (msg.sender == owner, 'caller must be owner');
 	
 	for (uint i=0; i<stakers.length; i++) {
 		address recipient = stakers[i];
 		//Issueing tokens to all stakers
 		uint balance = stakingBalance[recipient];
 		//addition protection to actual source code
 		if(balance > 0) {
 			dappToken.transfer(recipient, balance);
 		}
 	}

 }

}


