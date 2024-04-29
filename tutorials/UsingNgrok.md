`kubectl get svc -n ingress-nginx`

confirm that the External IP for the `load-balancer` is Localhost.

then navigate to where you install `ngrok` and type in `./ngrok http localhost`