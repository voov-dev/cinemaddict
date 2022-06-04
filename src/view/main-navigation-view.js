import AbstractView from '../framework/view/abstract-view.js';
import { getFilteredFilms } from '../mock/filters.js';

const createMainNavigationTemplate = (films) => {
  const filteredFilms = getFilteredFilms(films);

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filteredFilms.watchlist.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filteredFilms.history.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filteredFilms.favorite.length}</span></a>
    </nav>`
  );
};

export default class MainNavigationView extends AbstractView {
  #films;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createMainNavigationTemplate(this.#films);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    const beforeSelectedMainNavigationItem = this.element.querySelector('.main-navigation__item--active');
    const selectedMainNavigationItem = evt.target.closest('.main-navigation__item');

    if (!selectedMainNavigationItem.classList.contains('main-navigation__item--active')) {
      beforeSelectedMainNavigationItem.classList.remove('main-navigation__item--active');
      selectedMainNavigationItem.classList.add('main-navigation__item--active');

      this._callback.click();
    }
  };
}
