const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();
var argv = require('yargs')
    .option('address', {
        alias: 'a',
        describe: 'Get balance of address provided explicitly for token provided explicitly',
    })
    .check(function (argv) {
        if(argv.a) {
            if(argv.fromPublic && argv.fromPrivate && argv.to && argv.token) {
                return true;
            } else {
                throw new Error('from account public address(from public), private key, to account and token address necessary with -a flag')
            }
        } else {
            return true;
        }
	})
	.scriptName("transferTokens")
    .argv

const Accounts = JSON.parse(process.env.ACCOUNTS);
const Tokens = JSON.parse(process.env.TOKENS);

const tokenContract = require("./abi.json")
let WEB3_PROVIDER="http://127.0.0.1:8545"

if(process.env.WEB3_PROVIDER) {
	WEB3_PROVIDER = process.env.WEB3_PROVIDER
}
const transferTokens = async (fromPrivate, fromPublic, to, token, amount) => {
  	// connect to any peer; using infura here
	const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
	var contract = new web3.eth.Contract(tokenContract, token);
	const decryptedAccount = web3.eth.accounts.privateKeyToAccount(fromPrivate);
	
	web3.eth.getTransactionCount(fromPublic).then(function(v){
		var count = v;
		var rawTransaction = {
			"from":fromPublic,
			"gasPrice":web3.utils.toHex(20* 1e9),
			"gasLimit":web3.utils.toHex(210000),
			"to":token,
			"value":"0x0",
			"data":contract.methods.transfer(to, Number(amount)).encodeABI(),
			"nonce":web3.utils.toHex(count)
		}
		decryptedAccount.signTransaction(rawTransaction)
			.then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction))
			.then(receipt => console.log("Transaction receipt: ", receipt))
			.catch(err => console.error(err));
  	})
}
async function transferBalanceFromEnvironmentVariables() {
	let tokenIndex = Number(argv.tokenIndex)
	let fromIndex = Number(argv.fromIndex)
	let toIndex = Number(argv.toIndex)
	let amount = Number(argv.amount)

	tokenIndex = isNaN(tokenIndex) ? tokenIndex : tokenIndex >= Tokens.length || tokenIndex < 0 ? NaN : tokenIndex;
	fromIndex = isNaN(fromIndex) ? fromIndex : fromIndex >= Accounts.length || fromIndex < 0 ? NaN : fromIndex;
	toIndex = isNaN(toIndex) ? toIndex : toIndex >= Accounts.length || toIndex < 0 ? NaN : toIndex;
	amount = isNaN(amount) ? amount : amount < 0 ? NaN : amount;
	if(isNaN(tokenIndex)) {
		console.log("Invalid Token Index")
		return;
	}
	if(isNaN(fromIndex)) {
		console.log("Invalid from Index")
		return;
	}
	if(isNaN(amount)) {
		console.log("Invalid amount")
		return;
	}
	if(isNaN(toIndex)) {
		console.log("Invalid to Index")
		return;
	}
	transferTokens(Accounts[fromIndex].private, Accounts[fromIndex].public, Accounts[toIndex].public, Tokens[tokenIndex].public, amount);
}

async function transferBalanceFromExplicitlyProvidedAddresses() {
	let amount = Number(argv.amount)
	let fromPublic = argv.fromPublic;
	let fromPrivate = argv.fromPrivate;
	let to = argv.to;
	let token = argv.token;
	transferTokens(fromPrivate, fromPublic, to, token, amount);
}

function main() {
	if(argv.a) {
		transferBalanceFromExplicitlyProvidedAddresses();
	} else {
		transferBalanceFromEnvironmentVariables();
	}
}

main();
