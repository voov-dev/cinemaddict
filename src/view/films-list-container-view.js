import { createElement } from '../render.js';
import { AbstractView } from './abstract-view';

const createFilmsListContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

class FilmsListContainerView extends AbstractView {
  #element;

  constructor() {
    super();
    this.#element = null;
  }

  get #template() {
    return createFilmsListContainerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}

export default FilmsListContainerView;
