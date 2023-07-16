function Promise_min(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('Executor must be a function');
  }

  var self = this;
  self.state = 'pending';
  self.value = undefined;
  self.onResolvedCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (self.state === 'pending') {
      self.state = 'fulfilled';
      self.value = value;
      self.onResolvedCallbacks.forEach(function (callback) {
        callback(self.value);
      });
    }
  }

  function reject(reason) {
    if (self.state === 'pending') {
      self.state = 'rejected';
      self.value = reason;
      self.onRejectedCallbacks.forEach(function (callback) {
        callback(self.value);
      });
    }
  }

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise_min.prototype.then = function (onResolved, onRejected) {
  var self = this;
  var newPromise;

  onResolved = typeof onResolved === 'function' ? onResolved : function (value) { return value; };
  onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { throw reason; };

  if (self.state === 'fulfilled') {
    newPromise = new Promise_min(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });

  } else if (self.state === 'rejected') {
    newPromise = new Promise_min(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onRejected(self.value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });

  } else if (self.state === 'pending') {
    newPromise = new Promise_min(function (resolve, reject) {
      self.onResolvedCallbacks.push(function (value) {
        setTimeout(function () {
          try {
            var x = onResolved(value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });

      self.onRejectedCallbacks.push(function (reason) {
        setTimeout(function () {
          try {
            var x = onRejected(reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  }

  return newPromise;
};
Promise_min.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError('Circular promise chain'));
  }

  if (x && (typeof x === 'object' || typeof x === 'function')) {
    var then = x.then;

    if (typeof then === 'function') {
      then.call(
        x,
        function (y) {
          resolvePromise(promise, y, resolve, reject);
        },
        function (r) {
          reject(r);
        }
      );
      return;
    }
  }

  resolve(x);
}

Promise_min.resolve = function (value) {
  return new Promise_min(function (resolve) {
    resolve(value);
  });
};

Promise_min.reject = function (reason) {
  return new Promise_min(function (resolve, reject) {
    reject(reason);
  });
};

Promise_min.all = function (promises) {
  return new Promise_min(function (resolve, reject) {
    var resolvedCount = 0;
    var results = [];

    if (promises.length === 0) {
      resolve(results);
      return;
    }

    function processPromise(index, promise) {
      promise.then(function (value) {
        results[index] = value;
        resolvedCount++;

        if (resolvedCount === promises.length) {
          resolve(results);
        }
      }, function (reason) {
        reject(reason);
      });
    }

    for (var i = 0; i < promises.length; i++) {
      processPromise(i, promises[i]);
    }
  });
};

Promise_min.race = function (promises) {
  return new Promise_min(function (resolve, reject) {
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};


const axios = require("axios")
var promise = new Promise_min(function (resolve, reject) {
  axios.get('https://fastly.jsdelivr.net/gh/smallfawn/Note@main/Notice.json')
    .then(function (response) {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .catch(function (error) {
      reject(error);
    });
});

promise.then(function (value) {
  console.log('Promise fulfilled:', value);
}).catch(function (reason) {
  console.log('Promise rejected:', reason);
});
