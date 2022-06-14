import { render, replace, remove } from '../framework/render';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view';

const body = document.querySelector('body');

export default class MoviePresenter {
  #container = null;
  #popupContainer = null;
  #movieCardComponent = null;
  #popupComponent = null;
  #changeData = null;
  #movie = null;
  #comments = null;
  #resetPopup = null;

  constructor(container, popupContainer, changeData, resetPopup) {
    this.#container = container;
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#resetPopup = resetPopup;
  }

  init(movie, comments) {
    this.#movie = movie;
    this.#comments = comments;
    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movieCardComponent = new MovieCardView(movie);

    this.#movieCardComponent.setOpenPopupHandler(() => {
      this.#onMovieClick();
    });

    this.#movieCardComponent.setAddToWatchlistHandler(this.#onClickAddToWatchlist);
    this.#movieCardComponent.setAddToWatchedHandler(this.#onClickAddToWatched);
    this.#movieCardComponent.setAddToFavoriteHandler(this.#onClickAddToFavorite);

    if (prevMovieCardComponent === null) {
      render(this.#movieCardComponent, this.#container.element);
      return;
    }

    if (this.#container.element.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }
    remove(prevMovieCardComponent);

    if (this.#popupComponent) {
      this.#openPopup();
    }
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup(this.#onEscKeyDown);
    }
  };

  #onMovieClick() {
    this.#openPopup();
  }

  #openPopup() {
    this.#resetPopup();
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#movie, this.#comments);
    this.#popupComponent.setClosePopupHandler(this.#onClickClosePopup);
    this.#popupComponent.setAddToWatchlistHandler(this.#onClickAddToWatchlist);
    this.#popupComponent.setAddToWatchedHandler(this.#onClickAddToWatched);
    this.#popupComponent.setAddToFavoriteHandler(this.#onClickAddToFavorite);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#popupContainer);
    }
  }

  #onClickClosePopup = () => {
    this.#closePopup(this.#onEscKeyDown);
  };

  #closePopup() {
    remove(this.#popupComponent);
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent = null;
  }

  #onClickAddToWatchlist = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
  };

  #onClickAddToWatched = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
  };

  #onClickAddToFavorite = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
  };

  resetPopupView = () => {
    if (this.#popupComponent === null) {
      return;
    }
    this.#closePopup(this.#onEscKeyDown);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#popupComponent);
  };
}
