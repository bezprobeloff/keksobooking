'use strict';

(function () {
  var main = document.querySelector('main');
  var map = document.querySelector('.map');
  var filtersForm = document.querySelector('form.map__filters');
  var filterHousingType = filtersForm.querySelector('select[name="housing-type"]');
  var filterHousingPrice = filtersForm.querySelector('select[name="housing-price"]');
  var filterHousingRooms = filtersForm.querySelector('select[name="housing-rooms"]');
  var filterHousingGuests = filtersForm.querySelector('select[name="housing-guests"]');
  var filterHousingFeaturesList = filtersForm.querySelectorAll('.map__checkbox');

  var data = [];

///////
  var housingTypeElement = filterHousingType.value;
  var housingPrice = {
    type: filterHousingPrice.value,
    value: filterHousingPrice.options[filterHousingPrice.selectedIndex].text
  };
  var housingRoomsElement = filterHousingRooms.value;
  var housingGuestsElement = filterHousingGuests.value;
  var housingFeaturesList = [];
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

////

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

  var onGetSuccess = function (newData) {
    window.pin.clearMapPins();
    data = newData;
    window.debounce(updateCards());
  };

  var onGetError = function (errorMessage) {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.addEventListener('keydown', onPopupEscPress);
  };

  filterHousingType.addEventListener('change', function () {
    housingTypeElement = filterHousingType.value;
    window.load(onGetSuccess, onGetError);
  });

  filterHousingRooms.addEventListener('change', function () {
    housingRoomsElement = filterHousingRooms.value;
    window.load(onGetSuccess, onGetError);
  });

  var updateSelectFilterFeaturesList = function () {
    housingFeaturesList.length = 0;
    for (var i = 0; i < filterHousingFeaturesList.length; i++) {
      if (filterHousingFeaturesList[i].checked) {
        housingFeaturesList.push(filterHousingFeaturesList[i].value);
      }
    }
    window.load(onGetSuccess, onGetError);
  };

  var createFeaturesCheckedHandler = function (featureElement) {
    featureElement.addEventListener('change', function () {
      updateSelectFilterFeaturesList();
    });
  };

  for (var i = 0; i < filterHousingFeaturesList.length; i++) {
    createFeaturesCheckedHandler(filterHousingFeaturesList[i]);
  }

  filterHousingPrice.addEventListener('change', function () {
    housingPrice.type = filterHousingPrice.value;
    housingPrice.value = filterHousingPrice.options[this.selectedIndex].text;
    window.load(onGetSuccess, onGetError);
  });

  window.map = {
    onGetSuccess: onGetSuccess,
    onGetError: onGetError
  };

})();
