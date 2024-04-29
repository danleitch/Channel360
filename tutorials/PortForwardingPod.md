### Command to Port forward a Pod.

```bash
kubectl get pods

auth-depl-dc69df8b9-9czqf           1/1     Running   0          38m
auth-mongo-depl-7667b8bc7f-hvz2v    1/1     Running   0          38m
client-depl-5554c7896c-vrmzb        1/1     Running   0          38m
nats-depl-5f44cf96f-g5pgh           1/1     Running   0          38m
tickets-depl-56579778-855sg         1/1     Running   0          38m
tickets-mongo-depl-ffc7d855-62stk   1/1     Running   0          38m

kubectl port-forward nats-depl-5f44cf96f-g5pgh 4222:4222

Forwarding from 127.0.0.1:4222 -> 4222
Forwarding from [::1]:4222 -> 4222
```

the first port is the port on your local machine that you want to access to get to the pod. the second port is the port on the pod thtyou want to access.

