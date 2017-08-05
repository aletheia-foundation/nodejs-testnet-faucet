## Oracles faucet

### Building from source

1. Clone repository
2. Update config.json `./config.json` (see config.json with placeholders below)
4. `npm install` from project's root
7. `npm run sass`
8. `npm run javascript`
9. Go to project's root and run `npm start`. Oracles faucet will be launched at `http://localhost:5000`

### Server config.json (`./config.json`) with placeholders
```
{
  "environment": "switcher between configurations: 'live' or 'dev'",
  "debug": "switch on/off server logs: true or false",
  "Ethereum": {
    "etherToTransfer": "type amount of Ether to be sent from faucet here, for example 0.5",
    "gasLimit": "type Ethereum transaction gas limit here, for example, 0x7b0c",
    "live": {
      "rpc": "type Ethereum RPC address here, for example http://127.0.0.1:8545",
      "account": "type sender address here, for example, 0xf36045454F66C7318adCDdF3B801E3bF8CfBc6a1",
      "privateKey": "type private key of sender here, for example, 54dd4125ed5418a7a68341413f4006256159f9f5ade8fed94e82785ef59523ab"
    },
    "dev": {
      ...
    }
  }
}
