# Arctic Scholar Portal

The Arctic Scholar Portal is an integration of the Arctic Scholar backend service and PolarMap.js for the frontend geographic viewer. It is a JavaScript Single-Page Application.

## Development Environment

The app is JavaScript and runs under Node.js. To start, install the base Node packages:

    $ npm install

Now you can start the local development server with Broccoli:

    $ broccoli serve

That's all. The server is now running at [http://localhost:4200/](http://localhost:4200/).

## Testing

TODO

## Deploying

This app is configured to run on Heroku-like platforms. This makes deployment as simple as a `git push`. In this instance, we are using [Dokku](https://github.com/progrium/dokku).

Start by setting up a Dokku instance on a server. Once it is online, you should be able to add it as a remote repository, and tell Dokku the app's name is `arctic-scholar-portal`:

    $ git remote add dokku dokku@sarcee:arctic-scholar-portal

Next, push master to that remote host. Note that Dokku only supports receiving from master at this time.

    $ git push dokku master

Dokku will then build and deploy a server, automatically restarting the existing instance if necessary. Any time you need to push a new version, just push to the dokku remote on git.

There are also some configuration options that may be useful with Dokku. For example, defining the default host:

    $ ssh dokku@sarcee domains:set arctic-scholar-portal arcticscholar.arcticconnect.ca

This tells the nginx instance running in Dokku to redirect requests to http://arcticscholar.arcticconnect.ca to this Node.js server.

## License

See LICENSE.

## Authors

James Badger <jpbadger@ucalgary.ca>
