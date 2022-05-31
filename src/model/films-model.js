import { generateFilm } from '../mock/films.js';

export default class FilmsModel {
  #films = Array.from({length: 15}, generateFilm);

  getFilms = () => this.#films;
}
