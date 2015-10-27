var fetch = require('node-fetch');
var extend = require('xtend');

function createHeaders(serviceKey) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Service-Key': serviceKey
  };
}

function handleResponse(res) {
  if (res.status < 200 || res.status >= 300) {
    throw new Error(res.statusText);
  }
  // Do not try to parse JSON if there is no content!
  return res.status === 204 ? null : res.json();
}

var TinyShipyardClient = function (shipyardUrl, serviceKey) {
  this.shipyardUrl = shipyardUrl.replace(/\/$/, ''); // Remove trailing slash!
  this.serviceKey = serviceKey;
};

TinyShipyardClient.prototype.createContainer = function (image, options) {
  var body = JSON.stringify(extend({
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
    'Image': image,
    'CpuShares': null,
    'Memory': null
  }, options));

  var promise = fetch(this.shipyardUrl + '/containers/create?name=', {
    method: 'POST',
    headers: createHeaders(this.serviceKey),
    body: body
  })
  .then(handleResponse)
  .then(function (json) { return json.Id; })
  .then(function (containerId) {
    // The container was created, but not started yet ...
    return fetch(this.shipyardUrl + '/containers/' + containerId + '/start', {
      method: 'POST',
      headers: createHeaders(this.serviceKey),
      body: body
    })
    .then(handleResponse)
    .then(function () {
      return containerId;
    });
  }.bind(this));

  return promise;
};

TinyShipyardClient.prototype.scaleContainer = function (containerId, count) {
  return fetch(this.shipyardUrl + '/api/containers/' + containerId + '/scale?n=' + count, {
    method: 'POST',
    headers: createHeaders(this.serviceKey)
  })
  .then(handleResponse)
  .then(function (json) {
    if (json.Errors.length) {
      throw new Error(json.Errors[0].toString());
    }
    return json.Scaled;
  });
}

TinyShipyardClient.prototype.getContainers = function () {
  return fetch(this.shipyardUrl + '/containers/json', {
    method: 'GET',
    headers: createHeaders(this.serviceKey)
  })
  .then(handleResponse);
}

TinyShipyardClient.prototype.destroyContainer = function (containerId) {
  return fetch(this.shipyardUrl + '/containers/' + containerId + '?force=true', {
    method: 'DELETE',
    headers: createHeaders(this.serviceKey)
  })
  .then(handleResponse);
}


module.exports = TinyShipyardClient;
