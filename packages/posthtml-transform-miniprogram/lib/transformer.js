'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createTransformAttr = createTransformAttr;
exports.createTransformEventAttr = createTransformEventAttr;
exports.createTransformAttrValue = createTransformAttrValue;
exports.default = transformer;

var _mapping = require('./mapping');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENTER_STR = '\n ';

/**
 * 通用属性名转换 
 * @example wx:if => s-if
 * @param {*} source 
 * @param {*} target 
 */
function createTransformAttr(source, target) {
  if (source === target) {
    return function (node) {
      return node;
    };
  }

  var sourceAttr = _mapping.mapping.attr[source];
  var targetAttr = _mapping.mapping.attr[target];
  return function (node) {
    var attrs = node.attrs;
    if (!attrs) return node;
    Object.keys(attrs).forEach(function (key) {
      var idx = sourceAttr.findIndex(function (attr) {
        return attr === key;
      });
      if (idx >= 0) {
        var attr = targetAttr[idx];
        var value = attrs[key];
        // some empty attr in posthtml like [s-else] will be tranform to [s-else=""]
        // so we should avoid tramform
        attrs[attr] = value === '' ? true : value;
        delete attrs[key];
      }
    });
    return node;
  };
}

/**
 * 通用属性事件名转换 
 * @param {*} source 
 * @param {*} target 
 */
function createTransformEventAttr(source, target) {
  // 支付宝小程序和微信小程序差异比较多
  if (target !== 'aliapp') {
    return returnSelf;
  }

  return transformAliappEventAttr;
}

var MATCH_EVENT_ATTR = /^(bind|catch){1}:?(.*)/;

/**
 * wx转换支付宝事件
 * @param {*} node 
 */
function transformAliappEventAttr(node) {
  var attrs = node.attrs;
  if (!attrs) return node;
  var commonEventMapping = {
    touchstart: 'TouchStart',
    touchmove: 'TouchMove',
    touchend: 'TouchEnd',
    touchcancel: 'TouchCancel',
    longtap: 'LongTap'
  };
  // capture-bind:* , capture-catch:* 支付宝不支持所以忽略
  Object.keys(attrs).forEach(function (key) {
    var matches = key.match(MATCH_EVENT_ATTR);
    if (!matches) return;

    var _matches = _slicedToArray(matches, 3),
        g = _matches[0],
        eventStartKey = _matches[1],
        eventName = _matches[2];
    // bind:* , bindtap => onTap
    // catch:* , catchtap => catchTap


    var evtName = commonEventMapping[eventName];
    if (!evtName) {
      evtName = eventName[0].toUpperCase() + eventName.slice(1);
    }
    var attr = 'on' + evtName;
    var value = attrs[key];
    attrs[attr] = value === '' ? true : value;
    delete attrs[key];
  });
  return node;
}

// 匹配2个以上大括号 like {{ data }} {{{ data }}}
var MATCH_BRACE = /(?:{){2,}([^}]+)(?:}){2,}/;

function createTransformAttrValue(source, target) {
  if (source === target) {
    return returnSelf;
  }

  var selector = {
    'swan': transformSwan,
    'aliapp': transfromAliapp,
    'my': transfromAliapp
  };

  return selector[target];
}

function returnSelf(node) {
  return node;
}

/**
 * aliapp 转换器
 * @param {*} node 
 */
function transfromAliapp(node) {
  var attrs = node.attrs || {};
  if (node.tag === 'icon') {
    var iconTypeNoSupport = ['circle', 'info_circle'];
    if (iconTypeNoSupport.includes(attrs.type)) {
      console.warn('\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F <icon> \u4E0D\u652F\u6301 type: ' + attrs.type + ', \u4F1A\u5BFC\u81F4\u9875\u9762\u4E0D\u6E32\u67D3\u3002');
    }
  }
  if (node.tag === 'scroll-view') {
    var nameMapping = {
      bindscrolltoupper: 'onScrollToUpper',
      bindscrolltolower: 'onScrollToLower'
    };
    replaceAttrNames(nameMapping);
  }

  if (node.tag === 'picker-view') {
    var _nameMapping = {
      'indicator-style': 'indicatorStyle'
    };
    replaceAttrNames(_nameMapping);
  }

  if (node.tag === 'slider') {
    var _nameMapping2 = {
      'block-size': 'handleSize',
      'block-color': 'handleColor'
    };
    replaceAttrNames(_nameMapping2);
  }

  if (node.tag === 'image') {
    var _nameMapping3 = {
      'lazy-load': 'lazyLoad'
    };
    replaceAttrNames(_nameMapping3);
  }

  if (node.tag === 'canvas') {
    var _nameMapping4 = {
      'canvas-id': 'id'
    };
    replaceAttrNames(_nameMapping4);
  }

  if (node.tag === 'map') {
    var _nameMapping5 = {
      'bindmarkertap': 'onMarkerTap',
      'bindcallouttap': 'onCalloutTap',
      'bindcontroltap': 'onControlTap',
      'bindregionchange': 'onRegionChange'
    };
    replaceAttrNames(_nameMapping5);
  }

  return node;

  function replaceAttrNames(nameMapping) {
    Object.keys(nameMapping).forEach(function (name) {
      var value = attrs[name];
      if (value) {
        attrs[nameMapping[name]] = value;
        delete attrs[name];
      }
    });
  }
}

/**
 * swan 转换器
 * @param {*} node 
 */
function transformSwan(node) {
  // template: data={{}} => data={{{}}}
  var attrs = node.attrs || {};
  if (node.tag === 'template') {
    var data = attrs.data;
    if (!data) return node;
    node.attrs.data = data.replace(MATCH_BRACE, function (g, $1) {
      return '{{{' + $1 + '}}}';
    });
  }
  if (node.tag === 'scroll-view') {
    // {{ scroll }} => {= scroll =}
    ['scroll-top', 'scroll-left', 'scroll-into-view'].forEach(function (attr) {
      var contains = !!attrs[attr];
      if (!contains) return;
      node.attrs[attr] = attrs[attr].replace(MATCH_BRACE, function (g, $1) {
        return '{= ' + $1 + ' =}';
      });
    });
  }
  // https://smartapp.baidu.com/docs/develop/framework/view_for/
  // s-for与s-if不可在同一标签下同时使用。
  var keys = Object.keys(attrs);
  if (keys.includes('s-for') && keys.includes('s-if')) {
    console.warn('s-for\u4E0Es-if\u4E0D\u53EF\u5728\u540C\u4E00\u6807\u7B7E\u4E0B\u540C\u65F6\u4F7F\u7528\u3002\u6B63\u5728\u8F6C\u6362\u6DFB\u52A0block\u4F5C\u4E3As-for\u4F5C\u4E3A\u5FAA\u73AF\u6807\u7B7E');
    var value = attrs['s-for'];
    delete node.attrs['s-for'];
    node.content = [ENTER_STR, cloneNode(node), ENTER_STR];
    node.tag = 'block';
    node.attrs = {
      's-for': value
    };
  }

  return node;
}

function transformer(options) {
  var source = options.source,
      target = options.target;

  var transformAttr = createTransformAttr(source, target);
  var transformAttrValue = createTransformAttrValue(source, target);
  var transformEventAttr = createTransformEventAttr(source, target);
  return [transformAttr, transformAttrValue, transformEventAttr];
}

function cloneNode(node) {
  return _lodash2.default.cloneDeep(node);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc2Zvcm1lci5qcyJdLCJuYW1lcyI6WyJjcmVhdGVUcmFuc2Zvcm1BdHRyIiwiY3JlYXRlVHJhbnNmb3JtRXZlbnRBdHRyIiwiY3JlYXRlVHJhbnNmb3JtQXR0clZhbHVlIiwidHJhbnNmb3JtZXIiLCJFTlRFUl9TVFIiLCJzb3VyY2UiLCJ0YXJnZXQiLCJub2RlIiwic291cmNlQXR0ciIsIm1hcHBpbmciLCJhdHRyIiwidGFyZ2V0QXR0ciIsImF0dHJzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJpZHgiLCJmaW5kSW5kZXgiLCJrZXkiLCJ2YWx1ZSIsInJldHVyblNlbGYiLCJ0cmFuc2Zvcm1BbGlhcHBFdmVudEF0dHIiLCJNQVRDSF9FVkVOVF9BVFRSIiwiY29tbW9uRXZlbnRNYXBwaW5nIiwidG91Y2hzdGFydCIsInRvdWNobW92ZSIsInRvdWNoZW5kIiwidG91Y2hjYW5jZWwiLCJsb25ndGFwIiwibWF0Y2hlcyIsIm1hdGNoIiwiZyIsImV2ZW50U3RhcnRLZXkiLCJldmVudE5hbWUiLCJldnROYW1lIiwidG9VcHBlckNhc2UiLCJzbGljZSIsIk1BVENIX0JSQUNFIiwic2VsZWN0b3IiLCJ0cmFuc2Zvcm1Td2FuIiwidHJhbnNmcm9tQWxpYXBwIiwidGFnIiwiaWNvblR5cGVOb1N1cHBvcnQiLCJpbmNsdWRlcyIsInR5cGUiLCJjb25zb2xlIiwid2FybiIsIm5hbWVNYXBwaW5nIiwiYmluZHNjcm9sbHRvdXBwZXIiLCJiaW5kc2Nyb2xsdG9sb3dlciIsInJlcGxhY2VBdHRyTmFtZXMiLCJuYW1lIiwiZGF0YSIsInJlcGxhY2UiLCIkMSIsImNvbnRhaW5zIiwiY29udGVudCIsImNsb25lTm9kZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1BdHRyIiwidHJhbnNmb3JtQXR0clZhbHVlIiwidHJhbnNmb3JtRXZlbnRBdHRyIiwiXyIsImNsb25lRGVlcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFXZ0JBLG1CLEdBQUFBLG1CO1FBOEJB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QW9CSyxNQUFwQixFQUE0QkMsTUFBNUIsQ0FBdEI7QUFDQSxNQUFNc0QscUJBQXFCMUQseUJBQXlCRyxNQUF6QixFQUFpQ0MsTUFBakMsQ0FBM0I7QUFDQSxNQUFNdUQscUJBQXFCNUQseUJBQXlCSSxNQUF6QixFQUFpQ0MsTUFBakMsQ0FBM0I7QUFDQSxTQUFPLENBQUNxRCxhQUFELEVBQWdCQyxrQkFBaEIsRUFBb0NDLGtCQUFwQyxDQUFQO0FBQ0Q7O0FBRUQsU0FBU0osU0FBVCxDQUFtQmxELElBQW5CLEVBQXlCO0FBQ3ZCLFNBQU91RCxpQkFBRUMsU0FBRixDQUFZeEQsSUFBWixDQUFQO0FBQ0QiLCJmaWxlIjoidHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYXBwaW5nIH0gZnJvbSAnLi9tYXBwaW5nJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuXG5jb25zdCBFTlRFUl9TVFIgPSAnXFxuICdcblxuLyoqXG4gKiDpgJrnlKjlsZ7mgKflkI3ovazmjaIgXG4gKiBAZXhhbXBsZSB3eDppZiA9PiBzLWlmXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBcbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNmb3JtQXR0cihzb3VyY2UsIHRhcmdldCkge1xuICBpZiAoc291cmNlID09PSB0YXJnZXQpIHtcbiAgICByZXR1cm4gbm9kZSA9PiBub2RlXG4gIH1cblxuICBjb25zdCBzb3VyY2VBdHRyID0gbWFwcGluZy5hdHRyW3NvdXJjZV1cbiAgY29uc3QgdGFyZ2V0QXR0ciA9IG1hcHBpbmcuYXR0clt0YXJnZXRdXG4gIHJldHVybiAobm9kZSkgPT4ge1xuICAgIGNvbnN0IGF0dHJzID0gbm9kZS5hdHRyc1xuICAgIGlmICghYXR0cnMpIHJldHVybiBub2RlO1xuICAgIE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBzb3VyY2VBdHRyLmZpbmRJbmRleCgoYXR0cikgPT4gYXR0ciA9PT0ga2V5KVxuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSB0YXJnZXRBdHRyW2lkeF1cbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyc1trZXldXG4gICAgICAgIC8vIHNvbWUgZW1wdHkgYXR0ciBpbiBwb3N0aHRtbCBsaWtlIFtzLWVsc2VdIHdpbGwgYmUgdHJhbmZvcm0gdG8gW3MtZWxzZT1cIlwiXVxuICAgICAgICAvLyBzbyB3ZSBzaG91bGQgYXZvaWQgdHJhbWZvcm1cbiAgICAgICAgYXR0cnNbYXR0cl0gPSB2YWx1ZSA9PT0gJycgPyB0cnVlIDogdmFsdWVcbiAgICAgICAgZGVsZXRlIGF0dHJzW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBub2RlXG4gIH1cbn1cblxuLyoqXG4gKiDpgJrnlKjlsZ7mgKfkuovku7blkI3ovazmjaIgXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBcbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNmb3JtRXZlbnRBdHRyKHNvdXJjZSwgdGFyZ2V0KSB7XG4gIC8vIOaUr+S7mOWuneWwj+eoi+W6j+WSjOW+ruS/oeWwj+eoi+W6j+W3ruW8guavlOi+g+WkmlxuICBpZiAodGFyZ2V0ICE9PSAnYWxpYXBwJykge1xuICAgIHJldHVybiByZXR1cm5TZWxmXG4gIH1cblxuICByZXR1cm4gdHJhbnNmb3JtQWxpYXBwRXZlbnRBdHRyXG59XG5cbmNvbnN0IE1BVENIX0VWRU5UX0FUVFIgPSAvXihiaW5kfGNhdGNoKXsxfTo/KC4qKS9cblxuLyoqXG4gKiB3eOi9rOaNouaUr+S7mOWuneS6i+S7tlxuICogQHBhcmFtIHsqfSBub2RlIFxuICovXG5mdW5jdGlvbiB0cmFuc2Zvcm1BbGlhcHBFdmVudEF0dHIobm9kZSkge1xuICBjb25zdCBhdHRycyA9IG5vZGUuYXR0cnNcbiAgaWYgKCFhdHRycykgcmV0dXJuIG5vZGU7XG4gIGNvbnN0IGNvbW1vbkV2ZW50TWFwcGluZyA9IHtcbiAgICB0b3VjaHN0YXJ0OiAnVG91Y2hTdGFydCcsXG4gICAgdG91Y2htb3ZlOiAnVG91Y2hNb3ZlJyxcbiAgICB0b3VjaGVuZDogJ1RvdWNoRW5kJyxcbiAgICB0b3VjaGNhbmNlbDogJ1RvdWNoQ2FuY2VsJyxcbiAgICBsb25ndGFwOiAnTG9uZ1RhcCdcbiAgfVxuICAvLyBjYXB0dXJlLWJpbmQ6KiAsIGNhcHR1cmUtY2F0Y2g6KiDmlK/ku5jlrp3kuI3mlK/mjIHmiYDku6Xlv73nlaVcbiAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBjb25zdCBtYXRjaGVzID0ga2V5Lm1hdGNoKE1BVENIX0VWRU5UX0FUVFIpO1xuICAgIGlmICghbWF0Y2hlcykgcmV0dXJuO1xuICAgIGNvbnN0IFtnLCBldmVudFN0YXJ0S2V5LCBldmVudE5hbWVdID0gbWF0Y2hlcztcbiAgICAvLyBiaW5kOiogLCBiaW5kdGFwID0+IG9uVGFwXG4gICAgLy8gY2F0Y2g6KiAsIGNhdGNodGFwID0+IGNhdGNoVGFwXG4gICAgbGV0IGV2dE5hbWUgPSBjb21tb25FdmVudE1hcHBpbmdbZXZlbnROYW1lXVxuICAgIGlmICghZXZ0TmFtZSkge1xuICAgICAgZXZ0TmFtZSA9IGV2ZW50TmFtZVswXS50b1VwcGVyQ2FzZSgpICsgZXZlbnROYW1lLnNsaWNlKDEpXG4gICAgfVxuICAgIGNvbnN0IGF0dHIgPSAnb24nICsgZXZ0TmFtZTtcbiAgICBjb25zdCB2YWx1ZSA9IGF0dHJzW2tleV1cbiAgICBhdHRyc1thdHRyXSA9IHZhbHVlID09PSAnJyA/IHRydWUgOiB2YWx1ZVxuICAgIGRlbGV0ZSBhdHRyc1trZXldXG4gIH0pXG4gIHJldHVybiBub2RlO1xufVxuXG4vLyDljLnphY0y5Liq5Lul5LiK5aSn5ous5Y+3IGxpa2Uge3sgZGF0YSB9fSB7e3sgZGF0YSB9fX1cbmNvbnN0IE1BVENIX0JSQUNFID0gLyg/OnspezIsfShbXn1dKykoPzp9KXsyLH0vXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2Zvcm1BdHRyVmFsdWUoc291cmNlLCB0YXJnZXQpIHtcbiAgaWYgKHNvdXJjZSA9PT0gdGFyZ2V0KSB7XG4gICAgcmV0dXJuIHJldHVyblNlbGZcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdG9yID0ge1xuICAgICdzd2FuJzogdHJhbnNmb3JtU3dhbixcbiAgICAnYWxpYXBwJzogdHJhbnNmcm9tQWxpYXBwLFxuICAgICdteSc6IHRyYW5zZnJvbUFsaWFwcFxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yW3RhcmdldF1cbn1cblxuXG5cbmZ1bmN0aW9uIHJldHVyblNlbGYobm9kZSkge1xuICByZXR1cm4gbm9kZVxufVxuXG4vKipcbiAqIGFsaWFwcCDovazmjaLlmahcbiAqIEBwYXJhbSB7Kn0gbm9kZSBcbiAqL1xuZnVuY3Rpb24gdHJhbnNmcm9tQWxpYXBwKG5vZGUpIHtcbiAgY29uc3QgYXR0cnMgPSBub2RlLmF0dHJzIHx8IHt9XG4gIGlmIChub2RlLnRhZyA9PT0gJ2ljb24nKSB7XG4gICAgY29uc3QgaWNvblR5cGVOb1N1cHBvcnQgPSBbJ2NpcmNsZScsICdpbmZvX2NpcmNsZSddXG4gICAgaWYgKGljb25UeXBlTm9TdXBwb3J0LmluY2x1ZGVzKGF0dHJzLnR5cGUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYOaUr+S7mOWuneWwj+eoi+W6jyA8aWNvbj4g5LiN5pSv5oyBIHR5cGU6ICR7YXR0cnMudHlwZX0sIOS8muWvvOiHtOmhtemdouS4jea4suafk+OAgmApXG4gICAgfVxuICB9XG4gIGlmIChub2RlLnRhZyA9PT0gJ3Njcm9sbC12aWV3Jykge1xuICAgIGNvbnN0IG5hbWVNYXBwaW5nID0ge1xuICAgICAgYmluZHNjcm9sbHRvdXBwZXI6ICdvblNjcm9sbFRvVXBwZXInLFxuICAgICAgYmluZHNjcm9sbHRvbG93ZXI6ICdvblNjcm9sbFRvTG93ZXInXG4gICAgfVxuICAgIHJlcGxhY2VBdHRyTmFtZXMobmFtZU1hcHBpbmcpXG4gIH1cblxuICBpZiAobm9kZS50YWcgPT09ICdwaWNrZXItdmlldycpIHtcbiAgICBjb25zdCBuYW1lTWFwcGluZyA9IHtcbiAgICAgICdpbmRpY2F0b3Itc3R5bGUnOiAnaW5kaWNhdG9yU3R5bGUnXG4gICAgfVxuICAgIHJlcGxhY2VBdHRyTmFtZXMobmFtZU1hcHBpbmcpXG4gIH1cblxuICBpZiAobm9kZS50YWcgPT09ICdzbGlkZXInKSB7XG4gICAgY29uc3QgbmFtZU1hcHBpbmcgPSB7XG4gICAgICAnYmxvY2stc2l6ZSc6ICdoYW5kbGVTaXplJyxcbiAgICAgICdibG9jay1jb2xvcic6ICdoYW5kbGVDb2xvcidcbiAgICB9XG4gICAgcmVwbGFjZUF0dHJOYW1lcyhuYW1lTWFwcGluZylcbiAgfVxuXG4gIGlmIChub2RlLnRhZyA9PT0gJ2ltYWdlJykge1xuICAgIGNvbnN0IG5hbWVNYXBwaW5nID0ge1xuICAgICAgJ2xhenktbG9hZCc6ICdsYXp5TG9hZCdcbiAgICB9XG4gICAgcmVwbGFjZUF0dHJOYW1lcyhuYW1lTWFwcGluZylcbiAgfVxuXG4gIGlmIChub2RlLnRhZyA9PT0gJ2NhbnZhcycpIHtcbiAgICBjb25zdCBuYW1lTWFwcGluZyA9IHtcbiAgICAgICdjYW52YXMtaWQnOiAnaWQnXG4gICAgfVxuICAgIHJlcGxhY2VBdHRyTmFtZXMobmFtZU1hcHBpbmcpXG4gIH1cblxuICBpZiAobm9kZS50YWcgPT09ICdtYXAnKSB7XG4gICAgY29uc3QgbmFtZU1hcHBpbmcgPSB7XG4gICAgICAnYmluZG1hcmtlcnRhcCc6ICdvbk1hcmtlclRhcCcsXG4gICAgICAnYmluZGNhbGxvdXR0YXAnOiAnb25DYWxsb3V0VGFwJyxcbiAgICAgICdiaW5kY29udHJvbHRhcCc6ICdvbkNvbnRyb2xUYXAnLFxuICAgICAgJ2JpbmRyZWdpb25jaGFuZ2UnOiAnb25SZWdpb25DaGFuZ2UnXG4gICAgfVxuICAgIHJlcGxhY2VBdHRyTmFtZXMobmFtZU1hcHBpbmcpXG4gIH1cblxuICByZXR1cm4gbm9kZVxuXG4gIGZ1bmN0aW9uIHJlcGxhY2VBdHRyTmFtZXMobmFtZU1hcHBpbmcpIHtcbiAgICBPYmplY3Qua2V5cyhuYW1lTWFwcGluZykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXR0cnNbbmFtZV1cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBhdHRyc1tuYW1lTWFwcGluZ1tuYW1lXV0gPSB2YWx1ZTtcbiAgICAgICAgZGVsZXRlIGF0dHJzW25hbWVdO1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBzd2FuIOi9rOaNouWZqFxuICogQHBhcmFtIHsqfSBub2RlIFxuICovXG5mdW5jdGlvbiB0cmFuc2Zvcm1Td2FuKG5vZGUpIHtcbiAgLy8gdGVtcGxhdGU6IGRhdGE9e3t9fSA9PiBkYXRhPXt7e319fVxuICBjb25zdCBhdHRycyA9IG5vZGUuYXR0cnMgfHwge31cbiAgaWYgKG5vZGUudGFnID09PSAndGVtcGxhdGUnKSB7XG4gICAgY29uc3QgZGF0YSA9IGF0dHJzLmRhdGFcbiAgICBpZiAoIWRhdGEpIHJldHVybiBub2RlO1xuICAgIG5vZGUuYXR0cnMuZGF0YSA9IGRhdGEucmVwbGFjZShNQVRDSF9CUkFDRSwgKGcsICQxKSA9PiB7XG4gICAgICByZXR1cm4gYHt7eyR7JDF9fX19YFxuICAgIH0pXG4gIH1cbiAgaWYgKG5vZGUudGFnID09PSAnc2Nyb2xsLXZpZXcnKSB7XG4gICAgLy8ge3sgc2Nyb2xsIH19ID0+IHs9IHNjcm9sbCA9fVxuICAgIFsnc2Nyb2xsLXRvcCcsICdzY3JvbGwtbGVmdCcsICdzY3JvbGwtaW50by12aWV3J10uZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgY29uc3QgY29udGFpbnMgPSAhIWF0dHJzW2F0dHJdXG4gICAgICBpZiAoIWNvbnRhaW5zKSByZXR1cm47XG4gICAgICBub2RlLmF0dHJzW2F0dHJdID0gYXR0cnNbYXR0cl0ucmVwbGFjZShNQVRDSF9CUkFDRSwgKGcsICQxKSA9PiB7XG4gICAgICAgIHJldHVybiBgez0gJHskMX0gPX1gXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgLy8gaHR0cHM6Ly9zbWFydGFwcC5iYWlkdS5jb20vZG9jcy9kZXZlbG9wL2ZyYW1ld29yay92aWV3X2Zvci9cbiAgLy8gcy1mb3LkuI5zLWlm5LiN5Y+v5Zyo5ZCM5LiA5qCH562+5LiL5ZCM5pe25L2/55So44CCXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhdHRycylcbiAgaWYgKGtleXMuaW5jbHVkZXMoJ3MtZm9yJykgJiYga2V5cy5pbmNsdWRlcygncy1pZicpKSB7XG4gICAgY29uc29sZS53YXJuKGBzLWZvcuS4jnMtaWbkuI3lj6/lnKjlkIzkuIDmoIfnrb7kuIvlkIzml7bkvb/nlKjjgILmraPlnKjovazmjaLmt7vliqBibG9ja+S9nOS4unMtZm9y5L2c5Li65b6q546v5qCH562+YClcbiAgICBjb25zdCB2YWx1ZSA9IGF0dHJzWydzLWZvciddXG4gICAgZGVsZXRlIG5vZGUuYXR0cnNbJ3MtZm9yJ107XG4gICAgbm9kZS5jb250ZW50ID0gW0VOVEVSX1NUUiwgY2xvbmVOb2RlKG5vZGUpLCBFTlRFUl9TVFJdXG4gICAgbm9kZS50YWcgPSAnYmxvY2snXG4gICAgbm9kZS5hdHRycyA9IHtcbiAgICAgICdzLWZvcic6IHZhbHVlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGVcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNmb3JtZXIob3B0aW9ucykge1xuICBjb25zdCB7c291cmNlLCB0YXJnZXR9ID0gb3B0aW9uc1xuICBjb25zdCB0cmFuc2Zvcm1BdHRyID0gY3JlYXRlVHJhbnNmb3JtQXR0cihzb3VyY2UsIHRhcmdldClcbiAgY29uc3QgdHJhbnNmb3JtQXR0clZhbHVlID0gY3JlYXRlVHJhbnNmb3JtQXR0clZhbHVlKHNvdXJjZSwgdGFyZ2V0KVxuICBjb25zdCB0cmFuc2Zvcm1FdmVudEF0dHIgPSBjcmVhdGVUcmFuc2Zvcm1FdmVudEF0dHIoc291cmNlLCB0YXJnZXQpXG4gIHJldHVybiBbdHJhbnNmb3JtQXR0ciwgdHJhbnNmb3JtQXR0clZhbHVlLCB0cmFuc2Zvcm1FdmVudEF0dHJdXG59XG5cbmZ1bmN0aW9uIGNsb25lTm9kZShub2RlKSB7XG4gIHJldHVybiBfLmNsb25lRGVlcChub2RlKVxufVxuIl19