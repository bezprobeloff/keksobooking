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
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute('disabled', 'disabled');
    }
  };

  var enabledStateElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].removeAttribute('disabled');
    }
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
    window.form.resetForm();
    window.map.resetFilterForm();
    window.card.closePopup();
    window.pin.clearMapPins();
    window.pin.resetPositionPinMain();
    statePage = false;
  };

  disabledStateElements(mapFiltersFormElementsList);
  disabledStateElements(adFormElementsList);

  window.page = {
    enabledStatePage: enabledStatePage,
    disabledStatePage: disabledStatePage,
  };

})();
