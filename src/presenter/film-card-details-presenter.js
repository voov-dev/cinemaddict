import FilmCardDetailsView from '../view/film-card-details-view.js';
import { render } from '../framework/render.js';

export default class FilmCardDetailsPresenter {
  init(filmCardDetailsContainer, filmCard) {
    render(new FilmCardDetailsView(filmCard), filmCardDetailsContainer);
  }
}
