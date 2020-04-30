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
            if(argv.account && argv.token) {
                return true;
            } else {
                throw new Error('account and token address necessary with -a flag')
            }
        } else {
            return true;
        }
    })
    .argv

const Accounts = JSON.parse(process.env.ACCOUNTS);
const Tokens = JSON.parse(process.env.TOKENS);

const tokenContract = require("./abi.json")

// connect to any peer; using infura here
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const getBalance = async (account, token) => {
    try {
        var contract = new web3.eth.Contract(tokenContract, token);
        const symbol = await contract.methods.symbol().call();
        const balance = await contract.methods.balanceOf(account).call();
        console.log(`Balance: ${balance} ${symbol}`)
    } catch(err) {
        console.log(err);
    }
}

async function getEnvironmentVariableBalance() {
    let tokenIndex = Number(argv.tokenIndex)
    let accountIndex = Number(argv.accountIndex)
    tokenIndex = isNaN(tokenIndex) ? tokenIndex : tokenIndex >= Tokens.length || tokenIndex < 0 ? NaN : tokenIndex;
    accountIndex = isNaN(accountIndex) ? accountIndex : accountIndex >= Accounts.length || accountIndex < 0 ? NaN : accountIndex;

    if(isNaN(tokenIndex) && isNaN(accountIndex)) {
        for(let i = 0; i < Accounts.length; i++) {
            console.log(`For Account: ${Accounts[i].public}`)
            for(let j = 0; j < Tokens.length; j++) {
                await getBalance(Accounts[i].public, Tokens[j].public);
            }
        }
        console.log("-----------------------------");
        for(let i = 0; i < Tokens.length; i++) {
            console.log(`For Token Contract: ${Tokens[i].public}`)
            for(let j = 0; j < Tokens.length; j++) {
                await getBalance( Tokens[i].public, Tokens[j].public);
            }
        }
    } else if(isNaN(tokenIndex)) {
        console.log(`For Account: ${Accounts[accountIndex].public}`)
        for(let j = 0; j < Tokens.length; j++) {
            await getBalance(Accounts[accountIndex].public, Tokens[j].public);
        }
    } else if(isNaN(accountIndex)) {
        for(let i = 0; i < Accounts.length; i++) {
            console.log(`For Account: ${Accounts[i].public}`)
            await getBalance(Accounts[i].public, Tokens[tokenIndex].public);
        }
        console.log("-----------------------------");
        for(let i = 0; i < Tokens.length; i++) {
            console.log(`For Token Contract: ${Tokens[i].public}`)
            await getBalance( Tokens[i].public, Tokens[tokenIndex].public);
        }
    } else {
        console.log(`For Account: ${Accounts[accountIndex].public}`)
        await getBalance(Accounts[accountIndex].public, Tokens[tokenIndex].public);
    }
}

async function getExplicitAddressBalance() {
    await getBalance(argv.account, argv.token);
}

async function main() {
    if(argv.a) {
        getExplicitAddressBalance();
    } else {
        getEnvironmentVariableBalance();
    }
}

main();