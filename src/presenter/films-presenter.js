import { render } from '../framework/render.js';
import FilmsView from '../view/films-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsListView from '../view/films-list-view';
import FilmsListEmptyView from '../view/films-list-empty-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreView from '../view/show-more-view';
import FilmCardDetailsView from '../view/film-card-details-view';
import MainNavigationView from '../view/main-navigation-view.js';

const MAX_CARDS = 5;

export default class FilmsPresenter {
  #renderedFilmsCount = 0;
  #filmsModel = [];

  constructor(filmsWrapper) {
    this.filmsWrapper = filmsWrapper;
    this.FilmsComponent = new FilmsView();
    this.filmsListContainerComponent = new FilmsListContainerView();
    this.filmsListComponent = new FilmsListView();
    this.filmsListEmptyComponent = new FilmsListEmptyView();
    this.filmCardViewComponent = new FilmCardView();
    this.showMoreComponent = new ShowMoreView();
  }

  init(filmsModel) {
    this.#filmsModel = filmsModel;
    this.mainNavigationComponent = new MainNavigationView(this.#filmsModel);

    if (!this.#filmsModel.length) {
      render(this.filmsListEmptyComponent, this.filmsListContainerComponent.element);
    } else {
      for (let i = 0; i < Math.min(MAX_CARDS, this.#filmsModel.length); i++) {
        this.#renderFilmCard(this.#filmsModel[i]);
      }

      this.#renderedFilmsCount = Math.min(MAX_CARDS, this.#filmsModel.length);
      render(this.mainNavigationComponent, this.filmsWrapper);
      this.mainNavigationComponent.setClickHandler(this.#onMainNavigationItem);
    }

    render(this.filmsListContainerComponent, this.filmsListComponent.element);
    render(this.filmsListComponent, this.FilmsComponent.element);

    if (this.#filmsModel.length > this.#renderedFilmsCount) {
      render(this.showMoreComponent, this.filmsListComponent.element);

      this.showMoreComponent.setClickHandler(this.#onLoadMore);
    }

    render(this.FilmsComponent, this.filmsWrapper);
  }

  #renderFilmCard = (film) => {
    const filmComponent = new FilmCardView(film);
    const popupComponent = new FilmCardDetailsView(film);
    const popupContainerElement = document.querySelector('body');

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
      }
    };

    const openPopup = () => {
      if (popupContainerElement.querySelector('.film-details')) {
        popupContainerElement.querySelector('.film-details').remove();
      }

      popupContainerElement.classList.add('hide-overflow');
      popupContainerElement.appendChild(popupComponent.element);

      popupComponent.setCloseHandler(closePopup);
      document.addEventListener('keydown', onEscKeyDown);
    };

    function closePopup () {
      popupContainerElement.classList.remove('hide-overflow');
      popupContainerElement.removeChild(popupComponent.element);

      popupComponent.setCloseHandler(closePopup);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    filmComponent.setClickHandler(openPopup);

    render(filmComponent, this.filmsListContainerComponent.element);
  };

  #onLoadMore = () => {
    let newRenderedFilmsCount = this.#renderedFilmsCount + MAX_CARDS;

    if (this.#filmsModel.length <= newRenderedFilmsCount) {
      newRenderedFilmsCount = this.#filmsModel.length;

      this.showMoreComponent.element.remove();
      this.showMoreComponent.removeElement();
    }

    this.#filmsModel
      .slice(this.#renderedFilmsCount, newRenderedFilmsCount)
      .forEach((item) => this.#renderFilmCard(item));
    this.#renderedFilmsCount = newRenderedFilmsCount;
  };

  #onMainNavigationItem = () => {
    // добавлю перерисовку в следующем задании
  };
}
