'use strict';

(function () {
  var data;


  /////
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
  /////

  var updateCards = function () {
    window.card.closePopup();
    var fragment = document.createDocumentFragment();
    var newData = data.
    filter(function (nData) {
      return (nData.offer !== null);
    }).
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

  window.newData = {
    data: data,
    updateCards: updateCards
  };

})();
