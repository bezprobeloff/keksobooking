'use strict';

(function () {
  var MIN_SYMBOL_INPUT_TITLE = 30;
  var MAX_SYMBOL_INPUT_TITLE = 100;
  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;
  var MAX_PRICE = 1000000;
  var COUNT_ROOMS_NOT_FOR_GUESTS = 100;
  var PATH_AVATAR_DEFAULT = document.querySelector('.ad-form-header__preview > img').src;

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
  var adFormAvatarInput = adForm.querySelector('.ad-form__field > input[name="avatar"]');
  var adFormAvatarPreview = adForm.querySelector('.ad-form-header__preview > img');
  var adFormPhotoInput = adForm.querySelector('.ad-form__upload > input[name="images"]');
  var adFormPhoto = adForm.querySelector('.ad-form__photo');

  adFormTitleInput.required = true;
  adFormPriceInput.required = true;
  adFormTitleInput.minLength = MIN_SYMBOL_INPUT_TITLE;
  adFormTitleInput.maxLength = MAX_SYMBOL_INPUT_TITLE;
  adFormAdressInput.setAttribute('readonly', 'readonly');

  var initPhotoPath = function () {
    adFormAvatarPreview.src = PATH_AVATAR_DEFAULT;
    adFormPhoto.innerHTML = '<img src="#" alt="Фото жилья" width="70" height="70" class="visually-hidden"></img>';
    window.loadPhoto(adFormAvatarInput, adFormAvatarPreview);
    window.loadPhoto(adFormPhotoInput, adFormPhoto.querySelector('img'));
  };

  initPhotoPath();

  var syncTypeHouseFromPrice = function () {
    switch (adFormSelectTypeHouse.value) {
      case 'bungalo':
        adFormPriceInput.placeholder = MIN_PRICE_BUNGALO;
        break;
      case 'flat':
        adFormPriceInput.placeholder = MIN_PRICE_FLAT;
        break;
      case 'house':
        adFormPriceInput.placeholder = MIN_PRICE_HOUSE;
        break;
      case 'palace':
        adFormPriceInput.placeholder = MIN_PRICE_PALACE;
        break;
    }
  };

  syncTypeHouseFromPrice();

  adFormPriceInput.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value < parseInt(adFormPriceInput.placeholder, 10)) {
      target.setCustomValidity('Вы ввели меньше минимальной цены ' + adFormPriceInput.placeholder);
    } else if (target.value > MAX_PRICE) {
      target.setCustomValidity('Вы ввели больше максимальной цены ' + MAX_PRICE + '₽/за ночь');
    } else {
      target.setCustomValidity('');
    }
  });

  adFormSelectTypeHouse.addEventListener('change', function () {
    syncTypeHouseFromPrice();
  });

  adFormSelectTimein.addEventListener('change', function () {
    adFormSelectTimeout.selectedIndex = adFormSelectTimein.selectedIndex;
  });

  adFormSelectTimeout.addEventListener('change', function () {
    adFormSelectTimein.selectedIndex = adFormSelectTimeout.selectedIndex;
  });

  adFormResetButton.addEventListener('click', function () {
    window.page.disabledState();
  });

  var checkValidityRoomsFromCapacity = function (countRooms, countCapacity) {
    if ((parseInt(countRooms, 10) === COUNT_ROOMS_NOT_FOR_GUESTS) && (countCapacity > 0)) {
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
    initPhotoPath();
    syncTypeHouseFromPrice();
  };
  var onSuccess = function () {
    var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(successTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onPopupSuccessClose);
  };

  var onPopupEscPress = function (evt) {
    if (document.querySelector('main > .success') !== null) {
      window.common.isEscEvent(evt, onPopupSuccessClose);
    } else if (document.querySelector('main > .error') !== null) {
      window.common.isEscEvent(evt, onPopupErrorClose);
    }
  };

  var onPopupSuccessClose = function () {
    if (document.querySelector('main > .success') !== null) {
      document.querySelector('main > .success').remove();
    }

    window.page.disabledState();
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupSuccessClose);
  };

  var onPopupErrorClose = function () {
    if (document.querySelector('main > .error') !== null) {
      document.querySelector('main > .error').remove();
    }

    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupErrorClose);
  };

  var onError = function () {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorTemplate.cloneNode(true));
    main.appendChild(fragment);
    document.querySelector('main .error__button').addEventListener('click', onPopupErrorClose);
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onPopupErrorClose);
  };

  adForm.addEventListener('submit', function (evt) {
    window.load.set(new FormData(adForm), onSuccess, onError);
    evt.preventDefault();
  });

  window.form = {
    reset: resetForm
  };

})();
