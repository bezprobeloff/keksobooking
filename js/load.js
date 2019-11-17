'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var SUCCESS_CODE = 200;
  var CACHED_CODE = 302;
  var ERROR_NOT_FOUND_CODE = 404;
  var SERVER_ERROR_CODE = 500;
  var data;

  var sendRequest = function (requestType, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case SUCCESS_CODE:
          onSuccess(xhr.response);
          break;
        case CACHED_CODE:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
          break;
        case ERROR_NOT_FOUND_CODE:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
          break;
        case SERVER_ERROR_CODE:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
          break;
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
    if (url === URL_GET) {
      xhr.send();
    } else {
      xhr.send(data);
    }

  };

  window.load = function (onSuccess, onError) {
    sendRequest('GET', URL_GET, onSuccess, onError);
  };

  window.upload = function (newData, onSuccess, onError) {
    data = newData;
    sendRequest('POST', URL_POST, onSuccess, onError);
  };
})();
