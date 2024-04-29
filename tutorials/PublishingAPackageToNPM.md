We created a `Common` Folder in it, there is a `package.json` file, with the following config.

```json
{
  "name": "@channel360/common",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

take note of our name `<org-name>/<package-name>`

### How to publish to NPM

We have to publish our common folder to it's own seperate Git Repo. 
in the `.gitignore` file, we added the common folder to it. 

and set a remote called `common` to publish our changes for our common folder. 

```bash

npm publish --access public

```
> we are publishing as public for now, and we convert the orginization to private at a later stage

! If you see an error immediatly after running that command, and it's says something like add user or login. 
type `npm login` and follow the instructions.