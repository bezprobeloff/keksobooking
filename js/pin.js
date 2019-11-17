'use strict';

(function () {
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT_LIMIT_MIN = 130;
  var MAP_HEIGHT_LIMIT_MAX = 630;
  var MAP_PIN_MAIN_HEIGHT = 81;
  var MAP_PIN_MAIN_WIDTH = 33;
  var MAP_X_MIN = -(MAP_PIN_MAIN_WIDTH);
  var MAP_X_MAX = MAP_WIDTH - MAP_PIN_MAIN_WIDTH;
  var MAP_Y_MIN = MAP_HEIGHT_LIMIT_MIN - MAP_PIN_MAIN_HEIGHT;
  var MAP_Y_MAX = MAP_HEIGHT_LIMIT_MAX - MAP_PIN_MAIN_HEIGHT;

  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adFormAdressInput = document.querySelector('input[name="address"]');
  var startPositionPinMainX = mapPinMain.style.left;
  var startPositionPinMainY = mapPinMain.style.top;

  var resetPositionPinMain = function () {
    mapPinMain.style.left = startPositionPinMainX;
    mapPinMain.style.top = startPositionPinMainY;
  };

  var renderPin = function (data) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = data.location.x + 'px';
    pinElement.style.top = data.location.y + 'px';
    pinElement.querySelector('img').src = data.author.avatar;
    pinElement.querySelector('img').alt = data.offer.title;

    pinElement.addEventListener('click', function () {
      if (document.querySelector('.map > .map__card.popup') !== null) {
        document.querySelector('.map > .map__card.popup').remove();
      }
      if (document.querySelector('.map .map__pin--active') !== null) {
        document.querySelector('.map .map__pin--active').classList.remove('map__pin--active');
      }
      pinElement.classList.add('map__pin--active');
      window.card.render(data);
    });

    return pinElement;
  };

  var clearMapPins = function () {
    var pins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  var convertPxToNumber = function (str) {
    return parseInt(str.replace('px', ''), 10);
  };

  var getAddressMapPin = function (element) {
    adFormAdressInput.value = (convertPxToNumber(element.style.left) + MAP_PIN_MAIN_WIDTH)
      + ', ' + (convertPxToNumber(element.style.top) + MAP_PIN_MAIN_HEIGHT);
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    window.page.enabledState();
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (((mapPinMain.offsetLeft - shift.x) >= MAP_X_MIN) &&
      ((mapPinMain.offsetLeft - shift.x) <= MAP_X_MAX)) {
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }

      if (((mapPinMain.offsetTop - shift.y) <= MAP_Y_MAX) &&
      ((mapPinMain.offsetTop - shift.y) >= MAP_Y_MIN)) {
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      }

      getAddressMapPin(mapPinMain);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      getAddressMapPin(mapPinMain);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.common.ENTER_KEYCODE) {
      window.page.enabledState();
    }
  });

  window.pin = {
    mapPins: mapPins,
    render: renderPin,
    clearMap: clearMapPins,
    resetPositionMain: resetPositionPinMain
  };
})();
