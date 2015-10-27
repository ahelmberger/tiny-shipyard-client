# tiny-shipyard-client

A tiny client library for the [Shipyard](http://shipyard-project.com/) v3 API

[![npm](https://img.shields.io/npm/v/tiny-shipyard-client.svg?style=flat-square)](https://www.npmjs.com/package/tiny-shipyard-client) [![npm](https://img.shields.io/david/ahelmberger/tiny-shipyard-client.svg?style=flat-square)](https://www.npmjs.com/package/tiny-shipyard-client) [![npm downloads](https://img.shields.io/npm/dt/tiny-shipyard-client.svg?style=flat-square)](https://www.npmjs.com/package/tiny-shipyard-client)

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

__TinyShipyardClient(shipyardUrl, serviceKey) [constructor]__

* _shipyardUrl_ (string): The Shipyard URL, including protocol and port
* _serviceKey_ (number): The Shipyard service key for authentication

__TinyShipyardClient.prototype.getContainers()__

* _(returns)_: A promise with an array containing all running containers ([with the node's name prepended to the container name](https://docs.docker.com/swarm/api/swarm-api/))

_NOTE: this command will only list running containers!_

__TinyShipyardClient.prototype.createContainer(imageName, options)__

* _imageName_ (string): The name of the image you want to start a container from
* _options_ (object, optional): Additional options ([default options](#createcontainer), [available options](https://docs.docker.com/reference/api/docker_remote_api_v1.20/#create-a-container))
* _(returns)_: A promise with the ID of the newly started container

_NOTE: this command will immediately start the new container!_

__TinyShipyardClient.prototype.scaleContainer(containerId, instanceCount)__

* _containerId_ (string): The ID of the container you want to scale out
* _instanceCount_ (number): The number of additional instances you want to start
* _(returns)_: A promise with an array containing the IDs of the newly started containers

__TinyShipyardClient.prototype.destroyContainer(containerId)__

* _containerId_ (string): The ID of the container you want kill and destroy
* _(returns)_: A promise resolving to `null`

_NOTE: this command will also kill and destroy running containers!_

## Default Options

### createContainer

~~~ js
{
  'HostConfig': {
    'RestartPolicy': {
      'Name': 'always'
    },
    'Links': [],
    'Binds': [],
    'Privileged': false,
    'PublishAllPorts': true,
    'PortBindings': {}
  },
  'Links': [],
  'ExposedPorts': {},
  'Volumes': {},
  'Env': [],
  'AttachStdin': false,
  'Tty': true,
  'Image': '<your image name>',
  'CpuShares': null,
  'Memory': null
}
~~~
