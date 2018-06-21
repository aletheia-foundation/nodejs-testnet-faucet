pipeline {
    agent any
    tools { nodejs "node9.4" }
    stages {
        stage('Build') {
            steps {
                echo 'build step'
                sh 'npm install'
            }
        }
        stage('Deploy') {
            steps {
                sh 'scp -vv -oStrictHostKeyChecking=no -r ./ jenkins-deployer@aletheia-infrastructure.org:/var/www/nodejs-testnet-faucet/faucet'
                sh 'ssh -vv -oStrictHostKeyChecking=no jenkins-deployer@aletheia-infrastructure.org bash sudo /var/www/nodejs-testnet-faucet/restart-faucet.sh'

            }
        }
    }
}
