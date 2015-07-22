# Arctic Scholar Portal

The Arctic Scholar Portal is an integration of the Arctic Scholar backend service and PolarMap.js for the frontend geographic viewer. It is a JavaScript Single-Page Application.

## Development Environment

The app is JavaScript/CoffeeScript and runs under Node.js. To start, install the base Node packages:

    $ npm install

Then the assets can be installed with Bower:

    $ bower install

Now you can start the local development server with Gulp:

    $ gulp

That's all. The server is now running at [http://localhost:1337/](http://localhost:1337/).

### What's the different between Node packages and Bower?

Bower is for packages that are sent to the client; Node packages are used for the server only. Each system also has different dependency resolution systems, where Bower is optimized for the web browser.

## Testing

TODO

## Deploying

This app is configured to run on Heroku-like platforms. This makes deployment as simple as a `git push`. In this instance, we are using [Dokku](https://github.com/progrium/dokku).

Start by setting up a Dokku instance on a server. Once it is online, you should be able to add it as a remote repository, and tell Dokku the app's name is `as-portal`:

    $ git remote add dokku dokku@sarcee:as-portal

Next, push master to that remote host. Note that Dokku only supports receiving from master at this time.

    $ git push dokku master

Dokku will then build and deploy a server, automatically restarting the existing instance if necessary. Any time you need to push a new version, just push to the dokku remote on git.

There are also some configuration options that may be useful with Dokku. For example, defining the default host:

    $ ssh dokku@sarcee domains:set as-portal arcticscholar.arcticconnect.org

This tells the nginx instance running in Dokku to redirect requests to http://arcticscholar.arcticconnect.org to this Node.js server.

## License

See LICENSE.

## Authors

James Badger <jpbadger@ucalgary.ca>
