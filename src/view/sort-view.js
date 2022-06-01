import { createElement } from '../render.js';
import { AbstractView } from './abstract-view';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--active">Sort by rating</a></li>
  </ul>`
);

class SortView extends AbstractView {
  #element = null;

  constructor() {
    super();
  }

  get #template() {
    return createSortTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}

export default SortView;
