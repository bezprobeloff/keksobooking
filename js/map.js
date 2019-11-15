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

  var onGetSuccess = function (newData) {
    window.newData.setData(newData);
    window.newData.updateData();
  };

  var onGetError = function () {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.addEventListener('keydown', onPopupEscPress);
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
    for (var i = 0; i < filterHousingFeaturesList.length; i++) {
      if (filterHousingFeaturesList[i].checked) {
        housingFeaturesList.push(filterHousingFeaturesList[i].value);
      }
    }
    window.newData.onHousingFeaturesChange(housingFeaturesList);
    window.debounce(window.newData.updateData);
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
    window.newData.onHousingPriceValueChange(filterHousingPrice.options[this.selectedIndex].text);
    window.debounce(window.newData.updateData);
  });

  window.map = {
    onGetSuccess: onGetSuccess,
    onGetError: onGetError,
    resetFilterForm: resetFilterForm
  };

})();
