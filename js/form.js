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
  var mapFilterHousingType = mapfiltersForm.querySelector('select[name="housing-type"]');
  var mapFilterHousingPrice = mapfiltersForm.querySelector('select[name="housing-price"]');
  var mapFilterHousingRooms = mapfiltersForm.querySelector('select[name="housing-rooms"]');
  var mapFilterHousingGuests = mapfiltersForm.querySelector('select[name="housing-guests"]');
  var mapFilterHousingFeaturesList = mapfiltersForm.querySelectorAll('.map__checkbox');
  var mapDialog = document.querySelector('.map');
  var main = document.querySelector('main');

  var housingTypeElement = mapFilterHousingType.value;
  var housingPrice = {
    type: mapFilterHousingPrice.value,
    value: mapFilterHousingPrice.options[mapFilterHousingPrice.selectedIndex].text
  };
  var housingRoomsElement = mapFilterHousingRooms.value;
  var housingGuestsElement = mapFilterHousingGuests.value;
  var housingFeaturesList = [];

  var data = [];
  var serverData = {
    onHousingTypeChange: function (housingType) {},
    onHousingRoomsChange: function (housingRooms) {},
    onHousingGuestsChange: function (housingGuests) {},
    onHousingPriceChange: function (housingPriceType, housingPriceValue) {},
    onHousingFeaturesChange: function (housingFeatures) {}
  };

  serverData.onHousingTypeChange = window.debounce(function (housingType) {
    housingTypeElement = housingType;
  });
  serverData.onHousingRoomsChange = window.debounce(function (housingRooms) {
    housingRoomsElement = housingRooms;
  });
  serverData.onHousingFeaturesChange = window.debounce(function (housingFeatures) {
    housingFeaturesList = housingFeatures;
  });

  serverData.onHousingGuestsChange = window.debounce(function (housingGuests) {
    housingGuestsElement = housingGuests;
  });
  serverData.onHousingPriceChange = window.debounce(function (housingPriceType, housingPriceValue) {
    housingPrice.type = housingPriceType;
    housingPrice.value = housingPriceValue;
  });

  var getPriceRank = function (textPriceRank) {
    return textPriceRank.match(/\d+/gi);
  };

  var updateCards = function () {
    var fragment = document.createDocumentFragment();
    var newData = data.
      filter(function (nData) {
        return (housingTypeElement === 'any') ||
        (nData.offer.type === housingTypeElement);
      }).
      filter(function (nData) {
        var result = false;

        if (housingPrice.type === 'any') {
          result = true;
        } else if ((housingPrice.type === 'low') &&
          (nData.offer.price < getPriceRank(housingPrice.value))) {
          result = true;
        } else if ((housingPrice.type === 'high') &&
        (nData.offer.price > getPriceRank(housingPrice.value))) {
          result = true;
        } else if ((housingPrice.type === 'middle') &&
      (
        (nData.offer.price > getPriceRank(housingPrice.value)[0]) &&
        (nData.offer.price < getPriceRank(housingPrice.value)[1])
      )) {
          result = true;
        }
        return result;
      }).
      filter(function (nData) {
        return (housingRoomsElement === 'any') ||
        (nData.offer.rooms === parseInt(housingRoomsElement, 10));
      }).
      filter(function (nData) {
        return (housingGuestsElement === 'any') ||
        (nData.offer.guests === parseInt(housingGuestsElement, 10));
      }).
      filter(function (nData) {
        var result = false;

        if (housingFeaturesList.length === 0) {
          result = true;
        } else {
          var testRes = housingFeaturesList.every(function (featureGuest) {
            return nData.offer.features.includes(featureGuest);
          });

          if (testRes) {
            result = true;
          }
        }
        return result;
      }).
      filter(function (nData, i) {
        return i < 5;
      });

    newData.forEach(function (item) {
      fragment.appendChild(window.pin.renderPin(item));
    });
    window.pin.mapPins.appendChild(fragment);
  };

  var onGetSuccess = function (offersCards) {
    window.pin.clearMapPins();
    data = offersCards;
    window.debounce(updateCards());
  };

  //var onGetError = function () {
  //};

  var enabledStatePage = function () {
    mapDialog.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    enabledStateElements(adFormChildElementsList);
    enabledStateElements(mapfiltersFormChildElementsList);

    window.load(onGetSuccess, onSetError);

  };

  var disabledSatePage = function () {
    mapDialog.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    disabledStateElements(adFormChildElementsList);
    disabledStateElements(mapfiltersFormChildElementsList);
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

  window.pin.mapPinMain.addEventListener('mousedown', function (evt) {
    enabledStatePage();
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

      if (((window.pin.mapPinMain.offsetLeft - shift.x) >= (-33)) &&
      ((window.pin.mapPinMain.offsetLeft - shift.x) <= (1200 - 33))) {
        window.pin.mapPinMain.style.left = (window.pin.mapPinMain.offsetLeft - shift.x) + 'px';
      }

      if (((window.pin.mapPinMain.offsetTop - shift.y) <= (630 - 65 - 16)) &&
      ((window.pin.mapPinMain.offsetTop - shift.y) >= (130 - 65 - 16))) {
        window.pin.mapPinMain.style.top = (window.pin.mapPinMain.offsetTop - shift.y) + 'px';
      }

      getAddressMapPin(window.pin.mapPinMain);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      getAddressMapPin(window.pin.mapPinMain);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

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


  mapFilterHousingType.addEventListener('change', function () {
    housingTypeElement = mapFilterHousingType.value;
    window.load(onGetSuccess, onSetError);
  });

  mapFilterHousingRooms.addEventListener('change', function () {
    housingRoomsElement = mapFilterHousingRooms.value;
    window.load(onGetSuccess, onSetError);
  });

  var updateSelectFilterFeaturesList = function () {
    housingFeaturesList.length = 0;
    for (var i = 0; i < mapFilterHousingFeaturesList.length; i++) {
      if (mapFilterHousingFeaturesList[i].checked) {
        housingFeaturesList.push(mapFilterHousingFeaturesList[i].value);
      }
    }
    window.load(onGetSuccess, onSetError);
  };

  var createFeaturesCheckedHandler = function (featureElement) {
    featureElement.addEventListener('change', function () {
      updateSelectFilterFeaturesList();
    });
  };

  for (var i = 0; i < mapFilterHousingFeaturesList.length; i++) {
    createFeaturesCheckedHandler(mapFilterHousingFeaturesList[i]);
  }

  mapFilterHousingPrice.addEventListener('change', function () {
    housingPrice.type = mapFilterHousingPrice.value;
    housingPrice.value = mapFilterHousingPrice.options[this.selectedIndex].text;
    window.load(onGetSuccess, onSetError);
  });

  disabledStateElements(adFormChildElementsList);
  disabledStateElements(mapfiltersFormChildElementsList);
  checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);

  var onSetSuccess = function () {
    var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(successTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    window.common.isEscEvent(evt, closePopup);
  };

  var closePopup = function () {
    //сделать универсальной для success and error
    document.querySelector('main > .success').remove();
    //document.querySelector('main > .error').remove();
    disabledSatePage();
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onSetError = function (errorMessage) {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.addEventListener('keydown', onPopupEscPress);
  };

  adForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(adForm), onSetSuccess, onSetError);
    evt.preventDefault();
  });

})();
