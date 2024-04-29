Run this command to expose your DB for use by MongoDB Compass.

```bash
kubectl port-forward service/auth-mongo-srv 27018:27017

```

then connect on compass to

> mongodb://localhost:27018

```bash
subscriber Service
kubectl port-forward service/subscribers-mongo-srv 27019:27017
```

```bash
Template Service
kubectl port-forward service/templates-mongo-srv 27018:27017
```
