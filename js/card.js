'use strict';

(function () {
  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
  var mapDialog = document.querySelector('.map');

  var renderCard = function (data) {
    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = data.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = data.offer.address;
    cardElement.querySelector('.popup__text--price').innerHTML = data.offer.price + '₽<span>/ночь</span>';
    cardElement.querySelector('.popup__type').textContent = data.offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для '
      + data.offer.guests;
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin +
      ', выезд до ' + data.offer.checkout;

    var cardFeatures = cardElement.querySelectorAll('.popup__feature');
    for (var i = 0; i < cardFeatures.length; i++) {
      if (!data.offer.features.includes(cardFeatures[i].
        classList.value.replace(/.*popup__feature--/gi, ''))) {
        cardFeatures[i].remove();
      }
    }

    cardElement.querySelector('.popup__description').textContent = data.offer.description;
    data.offer.photos.forEach(function (item, i) {
      if (i === 0) {
        cardElement.querySelector('.popup__photo').src = item;
      } else {
        var newLinkPhoto = cardElement.querySelector('.popup__photo').cloneNode(true);
        newLinkPhoto.src = item;
        cardElement.querySelector('.popup__photos').appendChild(newLinkPhoto);
      }
    });

    cardElement.querySelector('.popup__avatar').src = data.author.avatar;

    var fragment = document.createDocumentFragment();
    fragment.appendChild(cardElement.cloneNode(true));
    mapDialog.appendChild(fragment);
  };

  window.card = {
    renderCard: renderCard
  };
})();
