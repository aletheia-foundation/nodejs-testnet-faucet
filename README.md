## NodeJs Ethereum faucet

### Building from source

1. Clone repository
2. In another terminal window start `npm run testrpc`
Several accounts and private keys will be output, leave this shell running.
3. Copy an account and matching private key into `./config/default.json`
4. `npm install` from project's root
9. Go to project's root and run `npm start`. The faucet will be launched at `http://localhost:5000`

### Deployment

#### Server Setup
https://blog.codeship.com/running-node-js-linux-systemd/
https://certsimple.com/blog/deploy-node-on-linux

```bash

sudo dd of=/etc/systemd/system/nodejs-faucet.service << EOF
  [Unit]
  Description=nodejs-faucet
  After=network.target

  [Service]
  ExecStart=/usr/bin/node /var/www/nodejs-testnet-faucet/faucet/index.js
  Restart=always
  User=faucet-daemon
  Group=faucet-daemon
  Environment=PATH=/usr/bin:/usr/local/bin
  Environment=NODE_ENV=production
  WorkingDirectory=/var/www/nodejs-testnet-faucet/faucet/

  [Install]
  WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nodejs-faucet
sudo systemctl start nodejs-faucet
```


#### Deploy via jenkins 
instructions https://github.com/aletheia-foundation/aletheia-admin/tree/master/infrastructure#setup-jenkins-to-deploy-via-ssh

