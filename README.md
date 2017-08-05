## NodeJs Ethereum faucet

### Building from source

1. Clone repository
2. In another terminal window start `npm run testrpc`
Several accounts and private keys will be output, leave this shell running.
3. Copy an account and matching private key into `./config/default.json`
4. `npm install` from project's root
9. Go to project's root and run `npm start`. The faucet will be launched at `http://localhost:5000`
