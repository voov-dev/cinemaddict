import { createElement } from '../render.js';
import { AbstractView } from './abstract-view';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>`
);

class FilmsListView extends AbstractView {
  #element = null;

  constructor() {
    super();
  }

  get #template() {
    return createFilmsListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}

export default FilmsListView;
