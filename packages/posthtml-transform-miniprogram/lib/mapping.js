'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * attr属性mapping表
 * 以微信小程序为优先,一一对应
 */

var wxAttrs = exports.wxAttrs = ['wx:for', 'wx:for-index', 'wx:for-item', 'wx:key', 'wx:if', 'wx:elif', 'wx:else'];

var swanAttrs = exports.swanAttrs = ['s-for', 's-for-index', 's-for-item', 's-key', // ''
's-if', 's-elif', 's-else'];

var aliappAttrs = exports.aliappAttrs = ['a:for', 'a:for-index', 'a:for-item', 'a:key', 'a:if', 'a:elif', 'a:else'];

var mapping = exports.mapping = {
  attr: {
    wx: wxAttrs,
    swan: swanAttrs,
    aliapp: aliappAttrs
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXBwaW5nLmpzIl0sIm5hbWVzIjpbInd4QXR0cnMiLCJzd2FuQXR0cnMiLCJhbGlhcHBBdHRycyIsIm1hcHBpbmciLCJhdHRyIiwid3giLCJzd2FuIiwiYWxpYXBwIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7OztBQUtPLElBQU1BLDRCQUFVLENBQ3JCLFFBRHFCLEVBRXJCLGNBRnFCLEVBR3JCLGFBSHFCLEVBSXJCLFFBSnFCLEVBS3JCLE9BTHFCLEVBTXJCLFNBTnFCLEVBT3JCLFNBUHFCLENBQWhCOztBQVVBLElBQU1DLGdDQUFZLENBQ3ZCLE9BRHVCLEVBRXZCLGFBRnVCLEVBR3ZCLFlBSHVCLEVBSXZCLE9BSnVCLEVBSWQ7QUFDVCxNQUx1QixFQU12QixRQU51QixFQU92QixRQVB1QixDQUFsQjs7QUFVQSxJQUFNQyxvQ0FBYyxDQUN6QixPQUR5QixFQUV6QixhQUZ5QixFQUd6QixZQUh5QixFQUl6QixPQUp5QixFQUt6QixNQUx5QixFQU16QixRQU55QixFQU96QixRQVB5QixDQUFwQjs7QUFVQSxJQUFNQyw0QkFBVTtBQUNyQkMsUUFBTTtBQUNKQyxRQUFJTCxPQURBO0FBRUpNLFVBQU1MLFNBRkY7QUFHSk0sWUFBUUw7QUFISjtBQURlLENBQWhCIiwiZmlsZSI6Im1hcHBpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGF0dHLlsZ7mgKdtYXBwaW5n6KGoXG4gKiDku6Xlvq7kv6HlsI/nqIvluo/kuLrkvJjlhYgs5LiA5LiA5a+55bqUXG4gKi9cblxuZXhwb3J0IGNvbnN0IHd4QXR0cnMgPSBbXG4gICd3eDpmb3InLFxuICAnd3g6Zm9yLWluZGV4JyxcbiAgJ3d4OmZvci1pdGVtJyxcbiAgJ3d4OmtleScsXG4gICd3eDppZicsXG4gICd3eDplbGlmJyxcbiAgJ3d4OmVsc2UnXG5dXG5cbmV4cG9ydCBjb25zdCBzd2FuQXR0cnMgPSBbXG4gICdzLWZvcicsXG4gICdzLWZvci1pbmRleCcsXG4gICdzLWZvci1pdGVtJyxcbiAgJ3Mta2V5JywgLy8gJydcbiAgJ3MtaWYnLFxuICAncy1lbGlmJyxcbiAgJ3MtZWxzZSdcbl1cblxuZXhwb3J0IGNvbnN0IGFsaWFwcEF0dHJzID0gW1xuICAnYTpmb3InLFxuICAnYTpmb3ItaW5kZXgnLFxuICAnYTpmb3ItaXRlbScsXG4gICdhOmtleScsXG4gICdhOmlmJyxcbiAgJ2E6ZWxpZicsXG4gICdhOmVsc2UnXG5dXG5cbmV4cG9ydCBjb25zdCBtYXBwaW5nID0ge1xuICBhdHRyOiB7XG4gICAgd3g6IHd4QXR0cnMsXG4gICAgc3dhbjogc3dhbkF0dHJzLFxuICAgIGFsaWFwcDogYWxpYXBwQXR0cnNcbiAgfVxufVxuIl19