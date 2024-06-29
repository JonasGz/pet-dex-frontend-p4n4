import { Component } from 'pet-dex-utilities';
import small from './images/small';
import medium from './images/medium';
import large from './images/large';

import './index.scss';

const events = ['click', 'keydown'];

const html = `
<div class="container-size-selector" role="radiogroup">
    <ul class="container-size-selector__size-list" data-select="card">
      <div class="container-size-selector__card" role="radio" aria-checked="false" tabindex="0">
        <li class="container-size-selector__card-size">
            <div class="container-size-selector__container-img">
                ${small}
            </div>
            <div class="container-size-selector__container-text">
                <h3 class="container-size-selector__title">Small</h3>
                <span class="container-size-selector__text">under 14kg</span>
            </div>
        </li>
      </div>
      <div class="container-size-selector__card container-size-selector__card--active" role="radio" aria-checked="true" tabindex="0">
        <li class="container-size-selector__card-size">
            <div class="container-size-selector__container-img">
                ${medium}
            </div>
            <div class="container-size-selector__container-text">
                <h3 class="container-size-selector__title">Medium</h3>
                <span class="container-size-selector__text">14-25kg</span>
            </div>
        </li>
      </div>
      <div class="container-size-selector__card" role="radio" aria-checked="false" tabindex="0">
        <li class="container-size-selector__card-size">
            <div class="container-size-selector__container-img">
                 ${large}
            </div>
      <div class="container-size-selector__container-text">
        <h3 class="container-size-selector__title">Large</h3>
        <span class="container-size-selector__text">over 25kg</span>
      </div>
        </li>
      </div>
    </ul>
  </div>
`;

export default function SizeSelector() {
  Component.call(this, { html, events });

  this.$sizeComponent = this.selected.get('card');

  this.$cards = Array.from(
    this.selected.get('card').querySelectorAll('[role="radio"]'),
  );

  const addEventListeners = (card, index) => {
    card.addEventListener('click', () => {
      this.selectCard(card, index);
      this.getCardActiveEvent('click', card, index);
    });
    card.addEventListener('keydown', (event) => {
      this.handleKeyDown(event, card);
    });
  };

  this.$cards.forEach((card, index) => addEventListeners(card, index));
}

SizeSelector.prototype = Object.assign(
  SizeSelector.prototype,
  Component.prototype,
  {
    setText(index, title, subtitle) {
      const h3 = this.$cards[index].querySelector('h3');
      const span = this.$cards[index].querySelector('span');
      h3.textContent = title;
      span.textContent = subtitle;
    },

    centerCard(index) {
      this.$cards.forEach((card, i) => {
        let orderCard;
        const cardItem = card;
        if (index === 2) {
          if (i === 0) orderCard = 2;
          if (i === 1) orderCard = 0;
          if (i === 2) orderCard = 1;
        }

        if (index === 0) {
          if (i === 0) orderCard = 1;
          if (i === 1) orderCard = 2;
          if (i === 2) orderCard = 0;
        }

        if (index === 1) {
          if (i === 0) orderCard = 0;
          if (i === 1) orderCard = 1;
          if (i === 2) orderCard = 2;
        }

        if (orderCard !== undefined) cardItem.style.order = orderCard;
      });
    },

    addActive(element, className) {
      this.$cards.forEach((card) => {
        card.setAttribute('aria-checked', 'false');
        card.classList.remove(className);
      });
      element.classList.add(className);
      element.setAttribute('aria-checked', 'true');
    },

    selectCard(selected, index) {
      this.addActive(selected, 'container-size-selector__card--active');
      this.centerCard(index);
    },

    handleKeyDown(event, card) {
      let next;
      let prev;
      let nextIndex;
      let prevIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        next = card.nextElementSibling;
        if (!next) [next] = this.$cards;
        nextIndex = this.$cards.indexOf(next);
        next.focus();
        this.selectCard(next, nextIndex);
        this.getCardActiveEvent('keydown', next, nextIndex);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        prev = card.previousElementSibling;
        if (!prev) prev = this.$cards[this.$cards.length - 1];
        prevIndex = this.$cards.indexOf(prev);
        prev.focus();
        this.selectCard(prev, prevIndex);
        this.getCardActiveEvent('keydown', prev, prevIndex);
      }
    },

    getCardActiveEvent(eventName, card, index) {
      if (eventName === 'click') this.emit('click', card, index);
      if (eventName === 'keydown') this.emit('keydown', card, index);
    },

    getCardActive() {
      const $activeCard = this.$cards.find((element) =>
        element.classList.contains('container-size-selector__card--active'),
      );
      const indexCard = this.$cards.findIndex((element) =>
        element.classList.contains('container-size-selector__card--active'),
      );
      return {
        card: $activeCard,
        index: indexCard,
      };
    },
  },
);
