'use strict';

(function () {
  var MAX_COUNT_PINS = 5;
  var data;
  var housingType;
  var housingPriceType;
  var housingPriceValue;
  var housingRooms;
  var housingGuests;
  var housingFeaturesList = [];

  var onHousingTypeChange = function (value) {
    housingType = value;
  };
  var onHousingRoomsChange = function (value) {
    housingRooms = value;
  };
  var onHousingGuestsChange = function (value) {
    housingGuests = value;
  };
  var onHousingPriceTypeChange = function (value) {
    housingPriceType = value;
  };
  var onHousingPriceValueChange = function (value) {
    housingPriceValue = value;
  };
  var onHousingFeaturesChange = function (value) {
    housingFeaturesList = value;
  };

  var setData = function (newData) {
    data = newData;
  };

  var getPriceRank = function (textPriceRank) {
    return textPriceRank.match(/\d+/gi);
  };

  var updateData = function () {
    window.card.closePopup();
    window.pin.clearMapPins();
    var fragment = document.createDocumentFragment();
    var filterData = data.
    filter(function (itemData) {
      return (itemData.offer !== null);
    }).
    filter(function (itemData) {
      return (housingType === 'any') ||
      (itemData.offer.type === housingType);
    }).
    filter(function (itemData) {
      var result = false;
      if (housingPriceType === 'any') {
        result = true;
      } else if ((housingPriceType === 'low') &&
        (itemData.offer.price < getPriceRank(housingPriceValue))) {
        result = true;
      } else if ((housingPriceType === 'high') &&
      (itemData.offer.price > getPriceRank(housingPriceValue))) {
        result = true;
      } else if ((housingPriceType === 'middle') &&
    (
      (itemData.offer.price > getPriceRank(housingPriceValue)[0]) &&
      (itemData.offer.price < getPriceRank(housingPriceValue)[1])
    )) {
        result = true;
      }
      return result;
    }).
    filter(function (itemData) {
      return (housingRooms === 'any') ||
      (itemData.offer.rooms === parseInt(housingRooms, 10));
    }).
    filter(function (itemData) {
      return (housingGuests === 'any') ||
      (itemData.offer.guests === parseInt(housingGuests, 10));
    }).
    filter(function (itemData) {
      var result = false;

      if (housingFeaturesList.length === 0) {
        result = true;
      } else {
        var testRes = housingFeaturesList.every(function (featureGuest) {
          return itemData.offer.features.includes(featureGuest);
        });

        if (testRes) {
          result = true;
        }
      }
      return result;
    }).
    filter(function (itemData, i) {
      return i < MAX_COUNT_PINS;
    });

    filterData.forEach(function (item) {
      fragment.appendChild(window.pin.renderPin(item));
    });
    window.pin.mapPins.appendChild(fragment);
  };

  window.newData = {
    setData: setData,
    onHousingTypeChange: onHousingTypeChange,
    onHousingRoomsChange: onHousingRoomsChange,
    onHousingGuestsChange: onHousingGuestsChange,
    onHousingPriceTypeChange: onHousingPriceTypeChange,
    onHousingPriceValueChange: onHousingPriceValueChange,
    onHousingFeaturesChange: onHousingFeaturesChange,
    updateData: updateData
  };

})();
