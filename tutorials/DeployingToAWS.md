Each Micro-frontend will be deployed individually to AWS.

We are going to push our code to Github, where a CI trigger will automatically deploy our code to AWS S3 and Cloudfront.


Amazon Cloudfront is a CDN that will serve our static files to the Client's browser.
