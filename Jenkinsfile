pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '339772065903.dkr.ecr.ap-south-1.amazonaws.com/eks-devops-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
        CLUSTER_NAME = '<cluster-name>' // replace with your EKS cluster name
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
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-crd'
                ]]) {
                    sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO'
                    sh 'docker push $ECR_REPO:$IMAGE_TAG'
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-crd'
                ]]) {
                    sh 'aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME'
                    sh "sed -i 's|339772065903.dkr.ecr.ap-south-1.amazonaws.com/eks-devops-app|$ECR_REPO:$IMAGE_TAG|g' deployment.yaml"
                    sh 'kubectl apply -f deployment.yaml'
                    sh 'kubectl apply -f service.yaml'
                }
            }
        }
    }
}
