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
                sshPublisher(
                    publishers: [sshPublisherDesc(
                            configName: 'aletheia-infrastructure',
                            verbose: true,
                            transfers: [ sshTransfer (
                                sourceFiles: '**/*.*',
                                // use a double slash to make the file path absolute (this seems odd)
                                remoteDirectory: '//var/www/nodejs-testnet-faucet/faucet',
                                execCommand: 'sudo /var/www/nodejs-testnet-faucet/restart-faucet.sh'
                            )]
                    )]

                )
            }
        }
    }
}
