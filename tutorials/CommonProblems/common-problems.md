### Accessing https://channel360.dev gives me "This website is unsafe"

1. type 'thisisunsafe' onto the web page thats prompting the error.

### I have update my Common folder, but it seems my micro-service's are not updated.

1. Run `npm update @channel360/common`
2. Run `npm uninstall @channel360/common` then Run `npm install @channel360/common`.

Docker Images are being built in arm64. build them in amd65
`docker buildx build --platform linux/amd64 -t codenameninja/auth . `
