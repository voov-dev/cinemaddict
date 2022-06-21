import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => (
  `<a href="#${filter.name}" data-type="${filter.type}" class="main-navigation__item ${filter.type === currentFilterType ? 'main-navigation__item--active' : ''}">
    ${filter.name} ${filter.name === FilterType.ALL ? '' : `<span class="main-navigation__item-count" data-type="${filter.type}">${filter.count}</span>`}
  </a>`
);

const createFiltersTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<nav class="main-navigation">
            ${filterItemsTemplate}
          </nav>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeClickHandler = (callback) => {
    this._callback.filterTypeClick = callback;
    const filterItems = this.element.querySelectorAll('.main-navigation__item');

    for (const filterItem of filterItems) {
      filterItem.addEventListener('click', this.#filterTypeClickHandler);
    }
  };

  #filterTypeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.type);
  };
}
