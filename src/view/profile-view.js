import { createElement } from '../render.js';
import { AbstractView } from './abstract-view';

const createProfileTemplate = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating ${rating ? '' : 'visually-hidden'}">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

class ProfileView extends AbstractView {
  #element;
  #rating;

  constructor(rating) {
    super();
    this.#element = null;
    this.#rating = rating;
  }

  get #template() {
    return createProfileTemplate(this.#rating);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}

export default ProfileView;
