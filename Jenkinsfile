pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '339772065903.dkr.ecr.ap-south-1.amazonaws.com/eks-devops-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/RushiPatil1881/19march.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t eks-app .'
            }
        }

        stage('Tag Image') {
            steps {
                sh 'docker tag eks-app:latest $ECR_REPO:$IMAGE_TAG'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ECR_REPO

                docker push $ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                sed -i "s|339772065903.dkr.ecr.ap-south-1.amazonaws.com/eks-devops-app|$ECR_REPO:$IMAGE_TAG|g" deployment.yaml
                kubectl apply -f deployment.yaml
                kubectl apply -f service.yaml
                '''
            }
        }
    }
}
