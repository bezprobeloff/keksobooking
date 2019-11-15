'use strict';

(function () {
  var main = document.querySelector('main');
  var adForm = document.querySelector('.ad-form');
  var adFormSelectRooms = adForm.querySelector('select[name="rooms"]');
  var adFormSelectCapacity = adForm.querySelector('select[name="capacity"]');
  var adFormSelectTypeHouse = adForm.querySelector('select[name="type"]');
  var adFormSelectTimein = adForm.querySelector('select[name="timein"]');
  var adFormSelectTimeout = adForm.querySelector('select[name="timeout"]');
  var adFormTitleInput = adForm.querySelector('input[name="title"]');
  var adFormPriceInput = adForm.querySelector('input[name="price"]');
  var adFormAdressInput = adForm.querySelector('input[name="address"]');
  var adFormResetButton = adForm.querySelector('.ad-form__reset');

  adFormTitleInput.required = true;
  adFormPriceInput.required = true;
  adFormTitleInput.minLength = 30;
  adFormTitleInput.maxLength = 100;
  adFormAdressInput.setAttribute('readonly', 'readonly');

  adFormPriceInput.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value < parseInt(adFormPriceInput.placeholder, 10)) {
      target.setCustomValidity('Вы ввели меньше минимальной цены ' + adFormPriceInput.placeholder);
    } else if (target.value > 1000000) {
      target.setCustomValidity('Вы ввели больше максимальной цены');
    } else {
      target.setCustomValidity('');
    }
  });

  adFormSelectTypeHouse.addEventListener('change', function () {
    switch (adFormSelectTypeHouse.value) {
      case 'bungalo':
        adFormPriceInput.placeholder = 0;
        break;
      case 'flat':
        adFormPriceInput.placeholder = 1000;
        break;
      case 'house':
        adFormPriceInput.placeholder = 5000;
        break;
      case 'palace':
        adFormPriceInput.placeholder = 10000;
        break;
    }
  });

  adFormSelectTimein.addEventListener('change', function () {
    adFormSelectTimeout.selectedIndex = adFormSelectTimein.selectedIndex;
  });

  adFormSelectTimeout.addEventListener('change', function () {
    adFormSelectTimein.selectedIndex = adFormSelectTimeout.selectedIndex;
  });

  adFormResetButton.addEventListener('click', function () {
    window.page.disabledStatePage();
  });

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

  adFormSelectRooms.addEventListener('change', function () {
    checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);
  });

  adFormSelectCapacity.addEventListener('change', function () {
    checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);
  });

  checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);


  var resetForm = function () {
    adForm.reset();
  };
  var onSuccess = function () {
    var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(successTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', closePopupSuccess);
  };

  var onPopupEscPress = function (evt) {
    if (document.querySelector('main > .success') !== null) {
      window.common.isEscEvent(evt, closePopupSuccess);
    } else if (document.querySelector('main > .error') !== null) {
      window.common.isEscEvent(evt, closePopupError);
    }
  };

  /*
  var closePopup = function () {
    if (document.querySelector('main > .success') !== null) {
      document.querySelector('main > .success').remove();
    } else if (document.querySelector('main > .error') !== null) {
      document.querySelector('main > .error').remove();
    }

    window.page.disabledStatePage();
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', closePopup);
  };
  */

  var closePopupSuccess = function () {
    if (document.querySelector('main > .success') !== null) {
      document.querySelector('main > .success').remove();
    }

    window.page.disabledStatePage();
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', closePopupSuccess);
  };

  var closePopupError = function () {
    if (document.querySelector('main > .error') !== null) {
      document.querySelector('main > .error').remove();
    }

    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', closePopupError);
  };

  var onError = function (errorMessage) {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.querySelector('main .error__button').addEventListener('click', closePopupError);
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', closePopupError);
  };

  adForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(adForm), onSuccess, onError);
    evt.preventDefault();
  });

  window.form = {
    resetForm: resetForm
  };

})();
