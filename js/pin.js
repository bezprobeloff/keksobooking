'use strict';

(function () {
  var MAP_PIN_MAIN_HEIGHT = 65 + 16;
  var MAP_PIN_MAIN_WIDTH = 33;
  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  var renderPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = pin.location.y + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    return pinElement;
  };

  var clearMapPins = function() {
    var pins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for(var pin of pins ) {
     pin.remove();
    }
  };

  window.pin = {
    MAP_PIN_MAIN_HEIGHT: MAP_PIN_MAIN_HEIGHT,
    MAP_PIN_MAIN_WIDTH: MAP_PIN_MAIN_WIDTH,
    mapPins: mapPins,
    mapPinMain: mapPinMain,
    renderPin: renderPin,
    clearMapPins: clearMapPins
  };
})();
