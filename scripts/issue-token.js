const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) {

	let tokenFarm = await TokenFarm.deployed()
	await tokenFarm.issueToken()

	//Code goes here
	console.log("Token Issued!")

	callback()

}