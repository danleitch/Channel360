### Install Doctl

[Guide](https://docs.digitalocean.com/reference/doctl/how-to/install/)

> M1 Users
> go to application, right click on terminal and select more info, check **open in rosetta**
> open terminal and run the following command:
> `arch -arm64 brew install doctl`

now with doctl installed.

### Authenticate

Go to https://cloud.digitalocean.com/account/api/tokens
<br />
and create a token.

Copy the token key and run the following command in your **terminal**

```bash
doctl auth init
<PASTE TOKEN>

you should see the following:
Validating token... OK
```

### Connection info for our Cluster.

```bash
doctl kubernetes cluster kubeconfig save <cluster_name>
```

> To get <cluster_name> got to your **Kubernetes** dashboard and click on your cluster and the name will be at the top.

### List all Contexts

```bash
kubectl config view
```

> the name field is what we will use to swap between contexts.

### Use a different Context.

```bash
kubectl config use-context <context_name>
```

## Deployment.

### Create a workflow

```yaml
name: deploy-auth-service

on:
  push:
    branches:
      - main
    paths:
      - "auth/**"

  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd auth && docker build -t ${{secrets.DOCKER_USERNAME}}/auth .
      - run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
      - run: docker push ${{secrets.DOCKER_USERNAME}}/auth
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{secrets.DOCTL_TOKEN}}
      - run: doctl kubernetes cluster kubeconfig save ${{secrets.CLUSTER_NAME}}
      - run: kubectl rollout restart deployment auth-dep
```

### Update Deployment.

Deployment for Infra

```yaml
name: deploy-manifest

on:
  push:
    branches:
      - main
    paths:
      - "infra/**"

  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{secrets.DOCTL_TOKEN}}
      - run: doctl kubernetes cluster kubeconfig save ${{secrets.CLUSTER_NAME}}
      - run: kubectl apply -f infra/k8s && kubectl apply -f infra/k8s-prod
```

### Add ENV variable.

if you cluster requires ENV variables. then add them while you are still in your Digital Ocean context.

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdaasd
```

### Ingress Setup.

Remember we have to install ingress-nginx into our cluster. as per the following documentation.

[Ingress-Nginx Docs](https://kubernetes.github.io/ingress-nginx/deploy/)
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/do/deploy.yaml`
Now run the following command:

```bash

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/do/deploy.yaml

```
