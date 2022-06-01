import { createElement } from '../render.js';
import { AbstractView } from './abstract-view';

const createShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

class ShowMoreView extends AbstractView {
  #element = null;

  constructor() {
    super();
  }

  get #template() {
    return createShowMoreTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}

export default ShowMoreView;
