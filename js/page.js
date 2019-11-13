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
    enabledStateElements(mapFiltersFormElementsList);
    if (!statePage) {
      window.load(window.map.onGetSuccess, window.map.onGetError);
    }
    statePage = true;
  };

  var disabledStatePage = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    disabledStateElements(adFormElementsList);
    disabledStateElements(mapFiltersFormElementsList);
    window.pin.clearMapPins();
    statePage = false;
  };

  disabledStateElements(mapFiltersFormElementsList);
  disabledStateElements(adFormElementsList);

  window.page = {
    enabledStatePage: enabledStatePage,
    disabledStatePage: disabledStatePage,
  };

})();
