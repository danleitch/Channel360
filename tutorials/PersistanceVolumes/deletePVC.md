`kubectl delete pvc --all `

if PVC is stuck terminating

kubectl patch pvc {PVC_NAME} -p '{"metadata":{"finalizers":null}}'
