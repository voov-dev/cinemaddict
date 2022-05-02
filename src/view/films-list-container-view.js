import { AbstractView } from './abstract-view';

const createFilmsListContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

class FilmsListContainerView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsListContainerTemplate();
  }
}

export default FilmsListContainerView;
