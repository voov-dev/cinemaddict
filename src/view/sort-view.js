import { AbstractView } from './abstract-view';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--active">Sort by rating</a></li>
  </ul>`
);

class SortView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createSortTemplate();
  }
}

export default SortView;
