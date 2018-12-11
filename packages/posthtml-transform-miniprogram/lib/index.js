'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _transformer = require('./transformer');

var _transformer2 = _interopRequireDefault(_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initOptions(options) {
  options = options || {};

  if (options.target === 'my') {
    options.target = 'aliapp';
  }

  return options;
}

function transform(options) {
  options = initOptions(options);
  return function (tree, callback) {
    var task = new _task2.default(tree, callback);
    var fns = (0, _transformer2.default)(options);
    task.append(fns);
    return task.walk();
  };
}

transform.match = function (expression, callback) {
  return function (tree) {
    tree.match(expression, callback);
  };
};

transform.walk = function (callback) {
  return function (tree) {
    tree.walk(callback);
  };
};

module.exports = transform;
exports.default = transform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbml0T3B0aW9ucyIsIm9wdGlvbnMiLCJ0YXJnZXQiLCJ0cmFuc2Zvcm0iLCJ0cmVlIiwiY2FsbGJhY2siLCJ0YXNrIiwiVGFzayIsImZucyIsImFwcGVuZCIsIndhbGsiLCJtYXRjaCIsImV4cHJlc3Npb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTQSxXQUFULENBQXFCQyxPQUFyQixFQUE4QjtBQUM1QkEsWUFBVUEsV0FBVyxFQUFyQjs7QUFFQSxNQUFJQSxRQUFRQyxNQUFSLEtBQW1CLElBQXZCLEVBQTZCO0FBQzNCRCxZQUFRQyxNQUFSLEdBQWlCLFFBQWpCO0FBQ0Q7O0FBRUQsU0FBT0QsT0FBUDtBQUNEOztBQUVELFNBQVNFLFNBQVQsQ0FBbUJGLE9BQW5CLEVBQTRCO0FBQzFCQSxZQUFVRCxZQUFZQyxPQUFaLENBQVY7QUFDQSxTQUFPLFVBQUNHLElBQUQsRUFBT0MsUUFBUCxFQUFvQjtBQUN6QixRQUFNQyxPQUFPLElBQUlDLGNBQUosQ0FBU0gsSUFBVCxFQUFlQyxRQUFmLENBQWI7QUFDQSxRQUFNRyxNQUFNLDJCQUFZUCxPQUFaLENBQVo7QUFDQUssU0FBS0csTUFBTCxDQUFZRCxHQUFaO0FBQ0EsV0FBT0YsS0FBS0ksSUFBTCxFQUFQO0FBQ0QsR0FMRDtBQU1EOztBQUVEUCxVQUFVUSxLQUFWLEdBQWtCLFVBQVNDLFVBQVQsRUFBcUJQLFFBQXJCLEVBQStCO0FBQy9DLFNBQU8sVUFBU0QsSUFBVCxFQUFlO0FBQ3BCQSxTQUFLTyxLQUFMLENBQVdDLFVBQVgsRUFBdUJQLFFBQXZCO0FBQ0QsR0FGRDtBQUdELENBSkQ7O0FBTUFGLFVBQVVPLElBQVYsR0FBaUIsVUFBU0wsUUFBVCxFQUFtQjtBQUNsQyxTQUFPLFVBQVNELElBQVQsRUFBZTtBQUNwQkEsU0FBS00sSUFBTCxDQUFVTCxRQUFWO0FBQ0QsR0FGRDtBQUdELENBSkQ7O0FBTUFRLE9BQU9DLE9BQVAsR0FBaUJYLFNBQWpCO2tCQUNlQSxTIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCB0cmFuc2Zvcm1lciBmcm9tICcuL3RyYW5zZm9ybWVyJ1xuXG5mdW5jdGlvbiBpbml0T3B0aW9ucyhvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cbiAgaWYgKG9wdGlvbnMudGFyZ2V0ID09PSAnbXknKSB7XG4gICAgb3B0aW9ucy50YXJnZXQgPSAnYWxpYXBwJ1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnNcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGluaXRPcHRpb25zKG9wdGlvbnMpXG4gIHJldHVybiAodHJlZSwgY2FsbGJhY2spID0+IHtcbiAgICBjb25zdCB0YXNrID0gbmV3IFRhc2sodHJlZSwgY2FsbGJhY2spO1xuICAgIGNvbnN0IGZucyA9IHRyYW5zZm9ybWVyKG9wdGlvbnMpXG4gICAgdGFzay5hcHBlbmQoZm5zKVxuICAgIHJldHVybiB0YXNrLndhbGsoKTtcbiAgfVxufVxuXG50cmFuc2Zvcm0ubWF0Y2ggPSBmdW5jdGlvbihleHByZXNzaW9uLCBjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24odHJlZSkge1xuICAgIHRyZWUubWF0Y2goZXhwcmVzc2lvbiwgY2FsbGJhY2spO1xuICB9XG59O1xuXG50cmFuc2Zvcm0ud2FsayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbih0cmVlKSB7XG4gICAgdHJlZS53YWxrKGNhbGxiYWNrKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0cmFuc2Zvcm07XG5leHBvcnQgZGVmYXVsdCB0cmFuc2Zvcm07XG4iXX0=