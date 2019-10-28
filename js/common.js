'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  window.common = {
    ENTER_KEYCODE: ENTER_KEYCODE,

    generateRandomNumberInRange: function (rangeMin, rangeMax) {
      return Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    },

    getRandomElementFromArray: function (arr) {
      return arr[window.common.generateRandomNumberInRange(0, arr.length - 1)];
    },

    getListRandomValues: function (values) {
      return values.filter(function () {
        return window.common.generateRandomNumberInRange(0, 1);
      });
    }
  };
})();
