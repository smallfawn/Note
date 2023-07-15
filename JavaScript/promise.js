function Promise(executor) {
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

Promise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  var newPromise;

  onResolved = typeof onResolved === 'function' ? onResolved : function (value) { return value; };
  onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { throw reason; };

  if (self.state === 'fulfilled') {
    newPromise = new Promise(function (resolve, reject) {
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
    newPromise = new Promise(function (resolve, reject) {
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
    newPromise = new Promise(function (resolve, reject) {
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

Promise.resolve = function (value) {
  return new Promise(function (resolve) {
    resolve(value);
  });
};

Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason);
  });
};

Promise.all = function (promises) {
  return new Promise(function (resolve, reject) {
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

Promise.race = function (promises) {
  return new Promise(function (resolve, reject) {
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};




var promise = new Promise(function (resolve, reject) {
  // 执行异步操作
  setTimeout(function () {
    var randomNumber = Math.random();
    if (randomNumber < 0.5) {
      resolve(randomNumber);
    } else {
      reject(new Error('Random number is greater than 0.5'));
    }
  }, 1000);
});

promise.then(function (value) {
  console.log('Promise fulfilled:', value);
}, function (reason) {
  console.log('Promise rejected:', reason);
});
