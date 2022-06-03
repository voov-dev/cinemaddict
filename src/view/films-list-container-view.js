import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmsListContainerView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createFilmsListContainerTemplate();
  }
}

