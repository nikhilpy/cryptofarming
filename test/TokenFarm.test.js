const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n){
	return web3.utils.toWei(n,'Ether');
}

contract('TokenFarm', ([owner, investor]) => {

	//Define variables
	let daiToken, dappToken, tokenFarm

	before(async() => {
		//Load contracts
		daiToken = await DaiToken.new()
		dappToken = await DappToken.new()
		tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

		//Transfer all dapp tokens to tokenfarm
		await dappToken.transfer(tokenFarm.address, tokens('1000000'))

		//Send tokens to investor
		await daiToken.transfer(investor, tokens('100'), { from: owner })

	})

	//Write Test here
	describe('Mock DAI deployment', async() => {

		it('has a name', async () => {

			const name = await daiToken.name()
			assert.equal(name, 'Mock DAI Token')

		})
	})

	describe('Dapp token deployement', async() => {

		it('has a name', async () => {

			const name = await dappToken.name()
			assert.equal(name, 'DApp Token')

		})
	})

	describe('Token farm deployement', async() => {

		it('has a name', async () => {

			const name = await tokenFarm.name()
			assert.equal(name, 'Dapp Token Farm')
			
		})
		it('contract has tokens', async () => {

			let balance = await dappToken.balanceOf(tokenFarm.address)
			assert.equal(balance.toString(), tokens('1000000'))
			
		})
	})

	describe('Farming tokens', async () => {
		it('rewards investor for staking mDai tokens', async () => {
			let result

			//Check investor balance before staking	
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

			//Stake mDai tokens
			await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
			await tokenFarm.stakeTokens(tokens('100'), { from: investor })

			//Check Staking result
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('100'), 'Token Farm mock DAI balance correct after staking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('100'), 'Investor staking balance correct after staking')

			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'true', 'Token Farm mock DAI balance correct after staking')

			//Issue tokens
			await tokenFarm.issueToken({ from: owner })

			//Check Balance after issueance
			result = await dappToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor DappToken wallet balance is correct after issueance')

			// Ensure that only owner can issue tokens
			await tokenFarm.issueToken({ from: investor }).should.be.rejected;

			// Unstake tokens
			await tokenFarm.unstakeTokens({ from: investor })

			// Check result after staking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor mock dai balance correct after staking')

			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('0'), 'Token Farm mock dai balance correct after staking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'false', 'investor staking balance correct after staking')

		})
	})
})