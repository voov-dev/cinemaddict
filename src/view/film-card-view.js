import { createElement } from '../render.js';
import { AbstractView } from './abstract-view';
import { getFormatedRuntime, getDescriptionPreview } from '../mock/utils.js';
import dayjs from 'dayjs';

const createFilmCardTemplate = (filmCardTemplate) => {
  const { poster, title, totalRating, genre, runtime, release, description } = filmCardTemplate.filmInfo;
  const { watchlist, alreadyWatched, favorite } = filmCardTemplate.userDetails;
  const comments = filmCardTemplate.comments;
  const descriprionPreview = getDescriptionPreview(description);
  const watchlistClassName = watchlist ? 'film-card__controls-item--active' : '';
  const alreadyWatchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = favorite ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${dayjs(release.date).format('YYYY')}</span>
          <span class="film-card__duration">${getFormatedRuntime(runtime)}</span>
          <span class="film-card__genre">${genre[0]}</span>
        </p>
        <img src="${poster}" alt="${title}" class="film-card__poster">
        <p class="film-card__description">${descriprionPreview}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

class FilmCardView extends AbstractView {
  #element;
  #filmCard;

  constructor(filmCard) {
    super();
    this.#element = null;
    this.#filmCard = filmCard;
  }

  get #template() {
    return createFilmCardTemplate(this.#filmCard);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}

export default FilmCardView;
