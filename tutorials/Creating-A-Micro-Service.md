## Creating a Microservice.

1) Create a folder and name it whatever is the name of your microservice. e.g `templates`

2) Copy
    > `package.json`

    > `tsconfig.json`

    > `Dockerfile`

    > `.dockerignore`

    > `src` directory.

3) Go into `package.json` and change the `name` key to the name of your microservice. 

> run `npm install` to install all the dependencies.  

4) build docker image. e.g `docker build -t codenameninja/<image-name> .`

5) Push the image to DockerHub. `docker push codenameninja/<image-name>`

6) Clean out `models`, `routes`, `events` and clean out imports in `index.ts` `app.ts`

7) add your block to `skaffold.yaml`

8) add a `deployment` and `mongodb-service` to `infra/k8s/` and specify the path of the endpoint in `k8s-dev` & `k8s-prod`.

9) add deployment for your microservice in .`github/workflows/`

10)  run `skaffold dev` to build and deploy your microservice.