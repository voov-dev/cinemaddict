import AbstractView from '../framework/view/abstract-view';
import { NoMoviesTextType } from '../const';

const createMoviesListEmptyTemplate = (filterType) => {
  const noMoviesTextValue = NoMoviesTextType[filterType];

  return (
    `<h2 class="films-list__title">${noMoviesTextValue}</h2>`
  );
};

export default class MoviesListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createMoviesListEmptyTemplate(this.#filterType);
  }
}
