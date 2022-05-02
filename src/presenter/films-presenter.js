import { render } from '../render';
import FilmsView from '../view/films-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsListView from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreView from '../view/show-more-view';

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

  init() {
    for (let i = 0; i < MAX_CARDS; i++) {
      render(new FilmCardView(), this.filmsListContainerComponent.getElement());
    }
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());
    render(this.filmsListComponent, this.FilmsComponent.getElement());
    render(this.showMoreComponent, this.filmsListComponent.getElement());
    render(this.FilmsComponent, this.filmsWrapper);
  }
}
