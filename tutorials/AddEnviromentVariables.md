The command to creating a `Secret` Object in our Kubernets Pod is the following:

```bash
> kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
secret/jwt-secret created
```

#### Update your Deployment file

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
        - name: auth
          image: codenameninja/auth
          env:
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY

---
apiVersion: v1
kind: Service
metadata:
  name: auth-srv
spec:
  selector:
    app: auth
  ports:
    - name: auth
      protocol: TCP
      port: 3000
      targetPort: 3000
```

#### If you are having an issue with your secrets

Try this:

```bash

kubectl describe secret jwt-secret

You should see JWT_KEY under "Data".

If not, you'll want to delete the key and create it again.

kubectl delete secret jwt-secret

asdf
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=
```

### Additional Secrets

```
kubectl create secret generic smooch-password-secret --from-literal=SMOOCH_PASSWORD=-tTCxEg2qLLvbuvXvnnFm2OpSsn3m61lIVNRuAbDF9Rr7pVSE_YtnauOFOMRv4QQozgVy4byI4ONXGMxCsjhtw

kubectl create secret generic smooch-username-secret --from-literal=SMOOCH_USERNAME=act_613a20ed8e638200d7351d45

kubectl create secret generic admin-secret --from-literal=ADMIN_JWT_KEY=asd
kubectl create secret generic sentry-dsn --from-literal=SENTRY_DSN=https://955aa4cd6d8046008ae8338da8570476@o4503969502855168.ingest.sentry.io/4503969828241408
kubectl create secret generic node-env --from-literal=NODE_ENV=staging
```

### Encoding Secrets.

```bash
echo -n 'admin' | base64
```
