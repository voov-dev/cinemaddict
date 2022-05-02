import { AbstractView } from './abstract-view';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>`
);

class FilmsListView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsListTemplate();
  }
}

export default FilmsListView;
