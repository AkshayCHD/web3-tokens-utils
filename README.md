# ERC20 Utils

## Getting Started
* Clone the repository   
    `git clone https://github.com/AkshayCHD/web3-tokens-utils.git`
* Move to Directory    
    `cd web3-tokens-utils`
* Install dependencies   
    `npm install`
* Create a .env file(required only for method 2 below)  
    `touch .env` 

## Usage
The repository has 2 scripts getBalance and transferTokens, we can use them to get the balance of any given account for any given token, and to transfer token amounts to any account.

### Method 1
By providing accounts and addresses explicitly

This is done using the `-a` flag

**getBalance**   
```
node getBalance.js -a --token=0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --account=0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
the parameters needed are `--token` that contains the public address of the token and `--account` that contains the public address of the holder.


**transferTokens**   
```
node transferToken.js -a --fromPublic=0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --fromPrivate=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --to=0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --amount=5 --token=0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
the parameters needed are `--token` that contains the token address `--fromPublic` that contains the public address of the holder, `--fromPrivate` that contains private key of the sender, `--to` that contains the public address of the reciever and `--amount` containing the amount of tokens to be sent.

### Method 2
The problem with above method is that we have to provide all the credentials again and again, so what we can do is keeping all those details saved as environment variables and access them using their indexes.
The environment variables required are 2 JSON arrays `ACCOUNTS` and `TOKENS`, 
```
ACCOUNTS= [{"private":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","public":"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},{"private":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","public":"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}]   
TOKENS= [{"public":"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},{"public":"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}]
```
NOTE: Make sure that the environment variables are assigned array that is written is single line. You can get the exact env variables by
```
var ACCOUNTS = [
    {
        // should contain public and private keys of your account
        private: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        public: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    {
        private: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        public: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    {
        // you can also add contract address here, to send tokens to it.
        // but do not provide this index in fromIndex as it doesn't have a private key.
        public: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
]

var TOKENS = [
    {
        public: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    {
        public: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
]


// Paste the result of these as it is in your .env file
console.log("ACCOUNTS=", JSON.stringify(ACCOUNTS));
console.log("TOKENS=", JSON.stringify(TOKENS));
```

You can create a .env file and paste the result of that code(with your public and private keys) there.

So to get balance


**getBalance**   
```
node getBalance.js --accountIndex=0 --tokenIndex=0
```
Gets the balance of ACCOUNTS\[0].public address for TOKENS\[0].public tokens

you can also get the balance of all the accounts using 
```
node getBalance.js
```

**transferTokens**   
```
node transferToken.js --tokenIndex=0 --fromIndex=0 --toIndex=1 --amount=10
```
So here we transfer 10 tokens from ACCOUNTS\[fromIndex].public to ACCOUNTS\[toIndex].public 

## Other Networks
To use the scripts to other network you can set the env variable `WEB3_PROVIDER=YOUR_INFURA_URL` to your infura url of the required network.
