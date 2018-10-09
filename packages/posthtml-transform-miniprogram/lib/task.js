'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
  function Task(tree, callback) {
    _classCallCheck(this, Task);

    this.tree = tree;
    this.callback = callback;
    this.fns = [];
    this.asyncTasks = 0;
    this.completed = false;
  }

  _createClass(Task, [{
    key: 'walk',
    value: function walk() {
      var _this = this;

      this.tree.walk(function (node) {
        return _this.fns.reduce(function (lnode, fn) {
          return fn(lnode, _this.addAsyncTasks.bind(_this), _this.done.bind(_this));
        }, node);
      });
      this.completed = true;
      this.done();
      return this.tree;
    }
  }, {
    key: 'addAsyncTasks',
    value: function addAsyncTasks() {
      this.asyncTasks++;
    }
  }, {
    key: 'destory',
    value: function destory() {
      this.fns.length = 0;
    }
  }, {
    key: 'done',
    value: function done() {
      var isTaskDone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (isTaskDone) this.asyncTasks--;
      if (!this.asyncTasks && this.completed) {
        this.destory();
        this.callback(null, this.tree);
      }
    }
  }, {
    key: 'append',
    value: function append(fn) {
      var _this2 = this;

      if (Array.isArray(fn)) {
        fn.forEach(function (f) {
          return _this2.append(f);
        });
      }

      if (typeof fn === 'function') this.fns.push(fn);
    }
  }]);

  return Task;
}();

exports.default = Task;