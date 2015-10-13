# tiny-shipyard-client

A tiny client library for the [Shipyard](http://shipyard-project.com/) v3 API

## Installation

~~~ sh
npm install --save tiny-shipyard-client
~~~

## Usage Example

~~~ js
var TinyShipyardClient = require('tiny-shipyard-client');

var client = new TinyShipyardClient(
  'http://localhost:8080', // your Shipyard URL
  'lksjfd98w3ohng89z3dfgp' // your Shipyard service key
);

client.createContainer('tutum/hello-world')
  .then(function (id) {
    // `id` is the newly deployed container id.
    // next, we can scale out the new container by another 2 instances:
    return client.scaleContainer(id, 2);
  })
  .then(function (ids) {
    // `ids` is an array of the newly deployed container ids.
  });
  .catch(function (error) {
    console.error(error.message);
  });
~~~

## Reference

### TinyShipyardClient(shipyardUrl, serviceKey) [constructor]

* __shipyardUrl__ (string): The Shipyard URL, including protocol and port
* __serviceKey__ (number): The Shipyard service key for authentication

### TinyShipyardClient.prototype.createContainer(imageName)

* __imageName__ (string): The name of the image you want to start a container from
* __<returns>__: A promise with the ID of the newly started container

### TinyShipyardClient.prototype.scaleContainer(containerId, instanceCount)

* __containerId__ (string): The ID of the container you want to scale out
* __instanceCount__ (number): The number of additional instances you want to start
* __<returns>__: A promise with an array containing the IDs of the newly started containers
