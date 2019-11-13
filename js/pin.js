'use strict';

(function () {
  var MAP_PIN_MAIN_HEIGHT = 65 + 16;
  var MAP_PIN_MAIN_WIDTH = 33;
  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  var renderPin = function (data) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = data.location.x + 'px';
    pinElement.style.top = data.location.y + 'px';
    pinElement.querySelector('img').src = data.author.avatar;
    pinElement.querySelector('img').alt = data.offer.title;

    pinElement.addEventListener('click', function () {
      if(document.querySelector('.map > .map__card.popup') !== null)
        document.querySelector('.map > .map__card.popup').remove();
      window.card.renderCard(data);
    });

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
