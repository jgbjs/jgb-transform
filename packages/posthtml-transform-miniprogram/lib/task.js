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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90YXNrLmpzIl0sIm5hbWVzIjpbIlRhc2siLCJ0cmVlIiwiY2FsbGJhY2siLCJmbnMiLCJhc3luY1Rhc2tzIiwiY29tcGxldGVkIiwid2FsayIsIm5vZGUiLCJyZWR1Y2UiLCJsbm9kZSIsImZuIiwiYWRkQXN5bmNUYXNrcyIsImJpbmQiLCJkb25lIiwibGVuZ3RoIiwiaXNUYXNrRG9uZSIsImRlc3RvcnkiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiYXBwZW5kIiwiZiIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLEk7QUFDbkIsZ0JBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQTRCO0FBQUE7O0FBQzFCLFNBQUtELElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsU0FBS0MsR0FBTCxHQUFXLEVBQVg7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixLQUFqQjtBQUNEOzs7OzJCQUVNO0FBQUE7O0FBQ0wsV0FBS0osSUFBTCxDQUFVSyxJQUFWLENBQWUsVUFBQ0MsSUFBRDtBQUFBLGVBQVUsTUFBS0osR0FBTCxDQUFTSyxNQUFULENBQWdCLFVBQUNDLEtBQUQsRUFBUUMsRUFBUixFQUFlO0FBQ3RELGlCQUFPQSxHQUFHRCxLQUFILEVBQVUsTUFBS0UsYUFBTCxDQUFtQkMsSUFBbkIsT0FBVixFQUF5QyxNQUFLQyxJQUFMLENBQVVELElBQVYsT0FBekMsQ0FBUDtBQUNELFNBRndCLEVBRXRCTCxJQUZzQixDQUFWO0FBQUEsT0FBZjtBQUdBLFdBQUtGLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxXQUFLUSxJQUFMO0FBQ0EsYUFBTyxLQUFLWixJQUFaO0FBQ0Q7OztvQ0FFZTtBQUNkLFdBQUtHLFVBQUw7QUFDRDs7OzhCQUVTO0FBQ1IsV0FBS0QsR0FBTCxDQUFTVyxNQUFULEdBQWtCLENBQWxCO0FBQ0Q7OzsyQkFFd0I7QUFBQSxVQUFwQkMsVUFBb0IsdUVBQVAsS0FBTzs7QUFDdkIsVUFBSUEsVUFBSixFQUFnQixLQUFLWCxVQUFMO0FBQ2hCLFVBQUksQ0FBQyxLQUFLQSxVQUFOLElBQW9CLEtBQUtDLFNBQTdCLEVBQXdDO0FBQ3RDLGFBQUtXLE9BQUw7QUFDQSxhQUFLZCxRQUFMLENBQWMsSUFBZCxFQUFvQixLQUFLRCxJQUF6QjtBQUNEO0FBQ0Y7OzsyQkFFTVMsRSxFQUFJO0FBQUE7O0FBQ1QsVUFBSU8sTUFBTUMsT0FBTixDQUFjUixFQUFkLENBQUosRUFBdUI7QUFDckJBLFdBQUdTLE9BQUgsQ0FBVztBQUFBLGlCQUFLLE9BQUtDLE1BQUwsQ0FBWUMsQ0FBWixDQUFMO0FBQUEsU0FBWDtBQUNEOztBQUVELFVBQUksT0FBT1gsRUFBUCxLQUFjLFVBQWxCLEVBQ0UsS0FBS1AsR0FBTCxDQUFTbUIsSUFBVCxDQUFjWixFQUFkO0FBQ0g7Ozs7OztrQkF6Q2tCVixJIiwiZmlsZSI6InRhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3IodHJlZSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnRyZWUgPSB0cmVlXG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgdGhpcy5mbnMgPSBbXVxuICAgIHRoaXMuYXN5bmNUYXNrcyA9IDA7XG4gICAgdGhpcy5jb21wbGV0ZWQgPSBmYWxzZVxuICB9XG5cbiAgd2FsaygpIHtcbiAgICB0aGlzLnRyZWUud2Fsaygobm9kZSkgPT4gdGhpcy5mbnMucmVkdWNlKChsbm9kZSwgZm4pID0+IHtcbiAgICAgIHJldHVybiBmbihsbm9kZSwgdGhpcy5hZGRBc3luY1Rhc2tzLmJpbmQodGhpcyksIHRoaXMuZG9uZS5iaW5kKHRoaXMpKVxuICAgIH0sIG5vZGUpKVxuICAgIHRoaXMuY29tcGxldGVkID0gdHJ1ZVxuICAgIHRoaXMuZG9uZSgpXG4gICAgcmV0dXJuIHRoaXMudHJlZVxuICB9XG5cbiAgYWRkQXN5bmNUYXNrcygpIHtcbiAgICB0aGlzLmFzeW5jVGFza3MrKztcbiAgfVxuXG4gIGRlc3RvcnkoKSB7XG4gICAgdGhpcy5mbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIGRvbmUoaXNUYXNrRG9uZSA9IGZhbHNlKSB7XG4gICAgaWYgKGlzVGFza0RvbmUpIHRoaXMuYXN5bmNUYXNrcy0tO1xuICAgIGlmICghdGhpcy5hc3luY1Rhc2tzICYmIHRoaXMuY29tcGxldGVkKSB7XG4gICAgICB0aGlzLmRlc3RvcnkoKVxuICAgICAgdGhpcy5jYWxsYmFjayhudWxsLCB0aGlzLnRyZWUpXG4gICAgfVxuICB9XG5cbiAgYXBwZW5kKGZuKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZm4pKSB7XG4gICAgICBmbi5mb3JFYWNoKGYgPT4gdGhpcy5hcHBlbmQoZikpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRoaXMuZm5zLnB1c2goZm4pXG4gIH1cbn1cbiJdfQ==