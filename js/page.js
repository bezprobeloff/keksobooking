'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormElementsList = adForm.querySelectorAll('fieldset, select, input');
  var map = document.querySelector('.map');
  var mapFiltersForm = document.querySelector('form.map__filters');
  var mapFiltersFormElementsList = mapFiltersForm
  .querySelectorAll('fieldset, select, input');
  var statePage = false;

  var disabledStateElements = function (arr) {
    arr.forEach(function (item) {
      item.setAttribute('disabled', 'disabled');
    });
  };

  var enabledStateElements = function (arr) {
    arr.forEach(function (item) {
      item.removeAttribute('disabled');
    });
  };

  var enabledStatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    enabledStateElements(adFormElementsList);
    if (!statePage) {
      window.load(window.map.onSuccess, window.map.onError);
    }
    enabledStateElements(mapFiltersFormElementsList);
    statePage = true;
  };

  var disabledStatePage = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    disabledStateElements(adFormElementsList);
    disabledStateElements(mapFiltersFormElementsList);
    window.form.reset();
    window.map.resetFilterForm();
    window.card.closePopup();
    window.pin.clearMap();
    window.pin.resetPositionMain();
    statePage = false;
  };

  disabledStateElements(mapFiltersFormElementsList);
  disabledStateElements(adFormElementsList);

  window.page = {
    enabledState: enabledStatePage,
    disabledState: disabledStatePage,
  };

})();
