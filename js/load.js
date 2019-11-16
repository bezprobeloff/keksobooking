'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var SUCCESS_CODE = 200;

  var sendRequest = function (requestType, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'mc');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(requestType, url);
    xhr.send();
  };

  window.load = function (onSuccess, onError) {
    sendRequest('GET', URL_GET, onSuccess, onError);
  };
  window.upload = function (onSuccess, onError) {
    sendRequest('POST', URL_POST, onSuccess, onError);
  };
})();
