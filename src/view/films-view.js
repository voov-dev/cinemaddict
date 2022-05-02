import { AbstractView } from './abstract-view';

const createFilmsListTemplate = () => (
  '<section class="films"></section>'
);

class FilmsView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsListTemplate();
  }
}

export default FilmsView;
