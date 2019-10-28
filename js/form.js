'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormSelectRooms = adForm.querySelector('select[name="rooms"]');
  var adFormSelectCapacity = adForm.querySelector('select[name="capacity"]');
  var adFormAdressInput = adForm.querySelector('input[name="address"]');
  var adFormChildElementsList = adForm.querySelectorAll('fieldset, select, input');
  var mapfiltersForm = document.querySelector('form.map__filters');
  var mapfiltersFormChildElementsList = mapfiltersForm
    .querySelectorAll('fieldset, select, input');
  var mapDialog = document.querySelector('.map');


  var enabledStatePage = function () {
    mapDialog.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    enabledStateElements(adFormChildElementsList);
    enabledStateElements(mapfiltersFormChildElementsList);

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.offersList.length; i++) {
      fragment.appendChild(window.pin.renderPin(window.data.offersList[i]));
    }
    window.pin.mapPins.appendChild(fragment);
  };

  var disabledStateElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute('disabled', 'disabled');
    }
  };

  var enabledStateElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].removeAttribute('disabled');
    }
  };

  var convertPxToNumber = function (str) {
    return parseInt(str.replace('px', ''), 10);
  };

  var getAddressMapPin = function (element) {
    adFormAdressInput.value = (convertPxToNumber(element.style.left) + window.pin.MAP_PIN_MAIN_WIDTH)
      + ', ' + (convertPxToNumber(element.style.top) + window.pin.MAP_PIN_MAIN_HEIGHT);

  };

  var checkValidityRoomsFromCapacity = function (countRooms, countCapacity) {
    if ((parseInt(countRooms, 10) === 100) && (countCapacity > 0)) {
      adFormSelectCapacity.setCustomValidity('Выберите вариант не для гостей');
    } else if (countRooms < countCapacity) {
      adFormSelectCapacity.setCustomValidity('Выберите не больше '
        + adFormSelectRooms.value + ' гостей[я]');
    } else {
      adFormSelectCapacity.setCustomValidity('');
    }
  };

  window.pin.mapPinMain.addEventListener('mousedown', function () {
    enabledStatePage();
    getAddressMapPin(window.pin.mapPinMain);
  });

  window.pin.mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.common.ENTER_KEYCODE) {
      enabledStatePage();
    }
  });

  adFormSelectRooms.addEventListener('click', function () {
    checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);
  });

  adFormSelectCapacity.addEventListener('click', function () {
    checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);
  });

  disabledStateElements(adFormChildElementsList);
  disabledStateElements(mapfiltersFormChildElementsList);
  checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);

})();
