'use strict';

(function () {
  var main = document.querySelector('main');
  var filtersForm = document.querySelector('form.map__filters');
  var filterHousingType = filtersForm.querySelector('select[name="housing-type"]');
  var filterHousingPrice = filtersForm.querySelector('select[name="housing-price"]');
  var filterHousingRooms = filtersForm.querySelector('select[name="housing-rooms"]');
  var filterHousingGuests = filtersForm.querySelector('select[name="housing-guests"]');
  var filterHousingFeaturesList = filtersForm.querySelectorAll('.map__checkbox');

  var resetFilterForm = function () {
    filtersForm.reset();
    window.newData.onHousingTypeChange(filterHousingType.value);
    window.newData.onHousingRoomsChange(filterHousingRooms.value);
    window.newData.onHousingGuestsChange(filterHousingGuests.value);
    window.newData.onHousingPriceTypeChange(filterHousingPrice.value);
    window.newData.onHousingPriceValueChange(filterHousingPrice.options[filterHousingPrice.selectedIndex].text);
    window.newData.onHousingFeaturesChange([]);
  };

  resetFilterForm();

  var onSuccess = function (newData) {
    window.newData.setData(newData);
    window.newData.updateData();
  };

  var onError = function () {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onPopupErrorClose);
  };

  var onPopupErrorClose = function () {
    if (document.querySelector('main > .error') !== null) {
      document.querySelector('main > .error').remove();
    }

    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupErrorClose);
  };

  var onPopupEscPress = function (evt) {
    if (document.querySelector('main > .error') !== null) {
      window.common.isEscEvent(evt, onPopupErrorClose);
    }
  };

  filterHousingType.addEventListener('change', function () {
    window.newData.onHousingTypeChange(filterHousingType.value);
    window.debounce(window.newData.updateData);
  });

  filterHousingRooms.addEventListener('change', function () {
    window.newData.onHousingRoomsChange(filterHousingRooms.value);
    window.debounce(window.newData.updateData);
  });

  var updateSelectFilterFeaturesList = function () {
    var housingFeaturesList = [];

    [].map.call(filterHousingFeaturesList, function (item) {
      if (item.checked) {
        housingFeaturesList.push(item.value);
      }
    });

    window.newData.onHousingFeaturesChange(housingFeaturesList);
    window.debounce(window.newData.updateData);
  };

  var createFeaturesCheckedHandler = function (featureElement) {
    featureElement.addEventListener('change', function () {
      updateSelectFilterFeaturesList();
    });
  };

  [].map.call(filterHousingFeaturesList, function (item) {
    createFeaturesCheckedHandler(item);
  });

  filterHousingPrice.addEventListener('change', function () {
    window.newData.onHousingPriceTypeChange(filterHousingPrice.value);
    window.newData.onHousingPriceValueChange(filterHousingPrice.selectedOptions[0].textContent);
    window.debounce(window.newData.updateData);
  });

  window.map = {
    onSuccess: onSuccess,
    onError: onError,
    resetFilterForm: resetFilterForm
  };

})();
