import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createFilmsListTemplate();
  }
}

