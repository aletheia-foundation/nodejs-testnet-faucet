## NodeJs Ethereum faucet

### Building from source

1. Clone repository
2. In another terminal window start `npm run testrpc`
Several accounts and private keys will be output, leave this shell running.
3. Copy an account and matching private key into `./config/default.json`
4. `npm install` from project's root
9. Go to project's root and run `npm start`. The faucet will be launched at `http://localhost:5000`

### Deployment
https://blog.codeship.com/running-node-js-linux-systemd/
https://certsimple.com/blog/deploy-node-on-linux

`vim /etc/systemd/system/nodejs-faucet.service`
```
  [Unit]
  Description=nodejs-faucet
  After=network.target

  [Service]
  ExecStart=/usr/bin/node /home/faucet-usr/nodejs-testnet-faucet/index.js
  Restart=always
  User=faucet-usr
  Group=faucet-usr
  Environment=PATH=/usr/bin:/usr/local/bin
  Environment=NODE_ENV=production
  WorkingDirectory=/home/faucet-usr/nodejs-testnet-faucet

  [Install]
  WantedBy=multi-user.target
```

```bash
  systemctl daemon-reload
  systemctl enable nodejs-faucet
  systemctl start nodejs-faucet
```
