 #### Troubleshooting.


 Here's the first thing to try:

1) Stop skaffold

2) Delete ingress-nginx with a `kubectl delete namespace ingress-nginx`

3) Redeploy ingress-nginx with the appropriate script
 ```
 kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml
 ```

4) Restart skaffold


you might have to run.

 Delete Validation Hook
 ```
 kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
 ```


if that all fails, also try *restarting your machine*