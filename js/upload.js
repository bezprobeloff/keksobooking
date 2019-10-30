'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  window.upload = function (data, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.response = 'json';

    xhr.addEventListener('load', function() {
      onSuccess(xhr.response);
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };

})();
