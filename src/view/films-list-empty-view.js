import { createElement } from '../render.js';
import { AbstractView } from './abstract-view';

const createFilmsListEmptyTemplate = () => ('<h2 class="films-list__title">There are no movies in our database</h2>');

class FilmsListEmptyView extends AbstractView {
  #element = null;

  constructor() {
    super();
  }

  get #template() {
    return createFilmsListEmptyTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}

export default FilmsListEmptyView;
