'use strict';

(function() {
  var URL = 'https://js.dump.academy/keksobooking/data';
  window.load = function(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.response = 'json';

    xhr.open('GET', URL);

    xhr.addEventListener('load', function() {
      onSuccess(xhr.response);
    });

    xhr.send();
  };
})();
