import { render } from '../render';
import FilmsView from '../view/films-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsListView from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreView from '../view/show-more-view';
import FilmCardDetailsView from '../view/film-card-details-view';

const MAX_CARDS = 5;

export default class FilmsPresenter {
  constructor(filmsWrapper) {
    this.filmsWrapper = filmsWrapper;
    this.FilmsComponent = new FilmsView();
    this.filmsListContainerComponent = new FilmsListContainerView();
    this.filmsListComponent = new FilmsListView();
    this.filmCardViewComponent = new FilmCardView();
    this.showMoreComponent = new ShowMoreView();
  }

  init(filmsModel) {
    this.filmsModel = filmsModel;

    for (let i = 0; i < MAX_CARDS; i++) {
      this.#renderFilmCard(this.filmsModel[i]);
    }

    render(this.filmsListContainerComponent, this.filmsListComponent.element);
    render(this.filmsListComponent, this.FilmsComponent.element);
    render(this.showMoreComponent, this.filmsListComponent.element);
    render(this.FilmsComponent, this.filmsWrapper);
  }

  #renderFilmCard (film) {
    const filmComponent = new FilmCardView(film);
    const popupComponent = new FilmCardDetailsView(film);
    const popupContainerElement = document.querySelector('body');
    const popupCloseButtonElement = popupComponent.element.querySelector('.film-details__close-btn');

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

      popupCloseButtonElement.addEventListener('click', closePopup);
      document.addEventListener('keydown', onEscKeyDown);
    };

    function closePopup () {
      popupContainerElement.classList.remove('hide-overflow');
      popupContainerElement.removeChild(popupComponent.element);

      popupCloseButtonElement.removeEventListener('click', closePopup);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    filmComponent.element.querySelector('.film-card__link').addEventListener('click', openPopup);

    render(filmComponent, this.filmsListContainerComponent.element);
  }
}
