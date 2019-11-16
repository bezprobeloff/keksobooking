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
    window.newData.set(newData);
    window.newData.update();
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
    window.debounce(window.newData.update);
  });

  filterHousingRooms.addEventListener('change', function () {
    window.newData.onHousingRoomsChange(filterHousingRooms.value);
    window.debounce(window.newData.update);
  });

  var updateSelectFilterFeaturesList = function () {
    var housingFeaturesList = [];
    for (var i = 0; i < filterHousingFeaturesList.length; i++) {
      if (filterHousingFeaturesList[i].checked) {
        housingFeaturesList.push(filterHousingFeaturesList[i].value);
      }
    }
    window.newData.onHousingFeaturesChange(housingFeaturesList);
    window.debounce(window.newData.update);
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
    window.newData.onHousingPriceTypeChange(filterHousingPrice.value);
    window.newData.onHousingPriceValueChange(filterHousingPrice.selectedOptions[0].textContent);
    window.debounce(window.newData.update);
  });

  window.map = {
    onSuccess: onSuccess,
    onError: onError,
    resetFilterForm: resetFilterForm
  };

})();
