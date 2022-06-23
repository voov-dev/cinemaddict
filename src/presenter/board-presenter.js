import MoviesView from '../view/movies-view';
import SortView from '../view/sort-view';
import MoviesList from '../view/movies-list-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import MoviesListContainerView from '../view/movies-list-container-view';
import MoviesExtraView from '../view/movies-extra-view';
import { remove, render, RenderPosition } from '../framework/render';
import MoviesListTitleView from '../view/movies-list-title-view';
import MoviesListEmptyView from '../view/movies-list-empty-view';
import MoviePresenter from './movie-presenter';
import { sortByDate, sortByRating, sortByCommentsAmount } from '../utils/movie';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit } from '../const';
import { Filter } from '../utils/filter';
import LoadingMoviesView from '../view/loading-movies-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import MoviesStaticticsView from '../view/movies-statistics-view';
import UserRankView from '../view/user-rank-view';
import { getRandomMovies, getRatedMoviesCount, getCommentedMoviesCount } from '../utils/movie';

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const MOVIES_COUNT_PER_STEP = 5;
const MAX_EXTRA_MOVIES_COUNT = 2;

export default class BoardPresenter {
  #footerElement = null;
  #moviesContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #commentsModel = null;
  #popupContainer = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(footerElement, moviesContainer, filterModel, moviesModel, commentsModel, popupContainer) {
    this.#footerElement = footerElement;
    this.#moviesContainer = moviesContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#popupContainer = popupContainer;
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #moviesComponent = new MoviesView();
  #moviesListComponent = new MoviesList();
  #moviesListContainerComponent = new MoviesListContainerView();
  #moviesExtraListRatedComponent = new MoviesExtraView('Top rated');
  #moviesExtraListCommentedComponent = new MoviesExtraView('Most commented');
  #moviesListContainerRatedComponent = new MoviesListContainerView();
  #moviesListContainerCommentedComponent = new MoviesListContainerView();
  #buttonShowMoreComponent = null;
  #sortComponent = null;
  #moviesListEmptyComponent = null;
  #moviesListTitleComponent = new MoviesListTitleView();
  #loadingMoviesComponent = new LoadingMoviesView();
  #userRankComponent = null;
  #moviesStatisticsComponent = null;
  #moviePresenter = new Map();
  #moviePresenterRated = new Map();
  #moviePresenterCommented = new Map();
  #moviePresenters = [this.#moviePresenter, this.#moviePresenterRated, this.#moviePresenterCommented];
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #isLoading = true;

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = [];

    for (const movie of movies) {
      if(Filter[this.#filterType](movie)) {
        filteredMovies.push(movie);
      }
    }

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.sort(sortByRating);
    }

    return filteredMovies;
  }

  init() {
    this.#renderBoard();
  }

  #renderLoading() {
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element);
    render(this.#loadingMoviesComponent, this.#moviesListComponent.element);
  }

  #renderSorting() {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeClickHandler(this.#handleSortTypeClick);
    render(this.#sortComponent, this.#moviesContainer);
  }

  #renderMovie(movie, container, mapPresenters) {
    if (mapPresenters.has(movie.id)) {
      mapPresenters.get(movie.id).init(movie);
      return;
    }

    const moviePresenter = new MoviePresenter(container, this.#footerElement, this.#handleViewAction, this.#resetPopup, this.#commentsModel, this.#popupContainer);

    moviePresenter.init(movie);
    mapPresenters.set(movie.id, moviePresenter);
  }

  #renderMovies = (movies, container, mapPresenters) => {
    movies.forEach((movie) => this.#renderMovie(movie, container, mapPresenters));
  };

  #renderShowMoreButton() {
    this.#buttonShowMoreComponent = new ButtonShowMoreView();
    render(this.#buttonShowMoreComponent, this.#moviesListComponent.element);
    this.#buttonShowMoreComponent.setShowMoreClickHandler(this.#handleShowMoviesClick);
  }

  #renderMostRated() {
    const movies = this.movies.slice();

    if (getRatedMoviesCount(movies) === 0) {
      return;
    }

    const isRepeatingMovies = movies
      .map((movie) => movie.comments.length)
      .filter((item) => item === movies[0].comments).length === movies.length;

    const ratedMovies = isRepeatingMovies ?
      getRandomMovies(movies, MAX_EXTRA_MOVIES_COUNT) :
      movies.sort(sortByRating).slice(0, MAX_EXTRA_MOVIES_COUNT);

    render(this.#moviesExtraListRatedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerRatedComponent, this.#moviesExtraListRatedComponent.element);
    this.#renderMovies(ratedMovies, this.#moviesListContainerRatedComponent, this.#moviePresenterRated);
  }

  #renderMostCommented() {
    const movies = this.movies.slice();

    if (getCommentedMoviesCount(movies) === 0) {
      return;
    }

    const isRepeatingMovies = movies
      .map((movie) => movie.comments.length)
      .filter((item) => item === movies[0].comments).length === movies.length;

    const commentedMovies = isRepeatingMovies ?
      getRandomMovies(movies, MAX_EXTRA_MOVIES_COUNT) :
      movies.sort(sortByCommentsAmount).slice(0, MAX_EXTRA_MOVIES_COUNT);

    render(this.#moviesExtraListCommentedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerCommentedComponent, this.#moviesExtraListCommentedComponent.element);
    this.#renderMovies(commentedMovies, this.#moviesListContainerCommentedComponent, this.#moviePresenterCommented);
  }

  #renderBoard() {
    const movies = this.movies;
    const moviesCount = movies.length;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#userRankComponent = new UserRankView(this.#moviesModel.movies);
    render(this.#userRankComponent, siteHeaderElement);

    if (moviesCount === 0) {
      this.#moviesListEmptyComponent = new MoviesListEmptyView(this.#filterType);
      render(this.#moviesComponent, this.#moviesContainer);
      render(this.#moviesListComponent, this.#moviesComponent.element);
      render(this.#moviesListEmptyComponent, this.#moviesListComponent.element);
      return;
    }

    this.#renderSorting();
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#moviesListTitleComponent, this.#moviesListComponent.element);
    render(this.#moviesListContainerComponent, this.#moviesListComponent.element);

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)), this.#moviesListContainerComponent, this.#moviePresenter);
    this.#renderMostRated();
    this.#renderMostCommented();
    this.#moviesStatisticsComponent = new MoviesStaticticsView(moviesCount);
    render(this.#moviesStatisticsComponent, siteFooterStatisticsElement);
  }

  #clearBoard({resetPresenters = true, resetRenderedMoviesCount = false, resetSortType = false} = {}) {
    const moviesCount = this.movies.length;

    if (resetPresenters) {
      this.#moviePresenters
        .forEach((map) => {
          [...map.values()].forEach((presenter) => presenter.destroy());
          map.clear();
        });
    }

    remove(this.#sortComponent);
    remove(this.#buttonShowMoreComponent);
    remove(this.#loadingMoviesComponent);
    remove(this.#moviesExtraListCommentedComponent);
    remove(this.#moviesExtraListRatedComponent);
    remove(this.#userRankComponent);
    remove(this.#moviesStatisticsComponent);

    this.#moviesListContainerComponent.clear();
    this.#moviesListContainerRatedComponent.clear();
    this.#moviesListContainerCommentedComponent.clear();

    if (this.#moviesListEmptyComponent) {
      remove(this.#moviesListEmptyComponent);
    }

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    } else {
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #resetPopup = () => {
    this.#moviePresenters
      .forEach((map) => [...map.values()]
        .forEach((presenter) => presenter.resetPopupView()));
  };

  #updatePopup(data) {
    this.#moviePresenters.forEach((presenters) => {
      const moviePresenter = presenters.get(data.id);
      if (moviePresenter && moviePresenter.isOpenedPopup()) {
        moviePresenter.openPopup(data);
      }
    });
  }

  #clearMostCommented() {
    this.#moviesListContainerCommentedComponent.clear();
  }

  #handleShowMoviesClick = () => {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);
    this.#renderMovies(movies, this.#moviesListContainerComponent, this.#moviePresenter);

    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      remove(this.#buttonShowMoreComponent);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenters.forEach((presenters) => {
          const moviePresenter = presenters.get(data.id);
          if (moviePresenter) {
            moviePresenter.init(data);
          }
        });
        this.#clearMostCommented();
        this.#renderMostCommented();
        break;
      case UpdateType.MINOR:
        this.#clearBoard({resetPresenters: false});
        this.#renderBoard();
        this.#updatePopup(data);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMoviesCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingMoviesComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, updateMovie, updateComment) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#uiBlocker.block();
        await this.#moviesModel.updateMovie(updateType, updateMovie);
        this.#uiBlocker.unblock();
        break;
      case UserAction.ADD_COMMENT:
        this.#uiBlocker.block();
        this.#moviePresenters.forEach((presenters) => {
          if (presenters.has(updateMovie.id)) {
            const moviePresenter = presenters.get(updateMovie.id);
            if (moviePresenter.isOpenedPopup()) {
              moviePresenter.setSaving();
            }
          }
        });
        try {
          await this.#commentsModel.addComment(updateType, updateMovie, updateComment);
          await this.#moviesModel.updateMovie(updateType, updateMovie);
        } catch(err) {
          this.#moviePresenters.forEach((presenters) => {
            if (presenters.has(updateMovie.id)) {
              const moviePresenter = presenters.get(updateMovie.id);
              if (moviePresenter.isOpenedPopup()) {
                moviePresenter.setAborting();
              }
            }
          });
        }
        this.#uiBlocker.unblock();
        break;
      case UserAction.DELETE_COMMENT:
        this.#moviePresenters.forEach((presenters) => {
          if (presenters.has(updateMovie.id)) {
            const moviePresenter = presenters.get(updateMovie.id);
            if (moviePresenter.isOpenedPopup()) {
              moviePresenter.setDeleting(updateComment);
            }
          }
        });
        try {
          await this.#commentsModel.deleteComment(updateType, updateMovie, updateComment);
          await this.#moviesModel.updateMovie(updateType, updateMovie);
        } catch(err) {
          this.#moviePresenters.forEach((presenters) => {
            if (presenters.has(updateMovie.id)) {
              const moviePresenter = presenters.get(updateMovie.id);
              if (moviePresenter.isOpenedPopup()) {
                moviePresenter.setAborting();
              }
            }
          });
        }
        break;
    }
  };

  #handleSortTypeClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedMoviesCount: true});
    this.#renderBoard();
  };
}
