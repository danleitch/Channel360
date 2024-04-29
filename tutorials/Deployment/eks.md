Spinning up an EKS instance

| Command  | Brief Description |
| :------------ |---------------:|
| `eksctl create cluster`                                                               | Create EKS Cluster with one nodegroup containing 2 m5.large nodes                 |
| `eksctl create cluster --name <name> --version 1.15 --node-types t3.micro --nodes 2   | Create EKS cluster with k8 version 1.15 with 2 t3.micro nodes                     |
| eksctl create cluster --name <name> --version 1.15 --nodegroup-name <nodegrpname> --node-type  t3.micro --nodes 2 --managed | create EKS cluster with managed node group  |
| eksctl create cluster --name <name> --fargate | EKS Cluster with Fargate Profile

[AWS CLI Install docs](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

then after installation, run `aws configure` and follow the prompts.

installing `EKSCTL` 
[Install docs](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)

### More Cluster Commands

|Command | Description|
| :----- | :----      |
| eksctl get nodegroup --cluster=eksctl-test| fetches information about the EKS Cluster.
|ekscel get cluster | lists Clusters
| eksctl delete cluster --name=eksctl-test | this will delete the eks cluster.

 Documentation to see what EC2 instance can run max limit of pods.
 [docs](https://github.com/awslabs/amazon-eks-ami/blob/master/files/eni-max-pods.txt)