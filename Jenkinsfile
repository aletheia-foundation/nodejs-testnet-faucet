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
                sh 'scp -r ./ aletheia-infrastructure.org:/var/www/nodejs-testnet-faucet'
            }
        }
    }
}
