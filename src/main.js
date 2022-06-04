import { render } from './render';
import SortView from './view/sort-view';
import ProfileView from './view/profile-view';
import FilmsModel from './model/films-model.js';
import FilmsPresenter from './presenter/films-presenter';

const pageHeaderElement = document.querySelector('.header');
const pageMainElement = document.querySelector('.main');

render(new ProfileView(), pageHeaderElement, 'beforeend');
render(new SortView(), pageMainElement);

const filmsModel = new FilmsModel().getFilms();

const filmsPresenter = new FilmsPresenter(pageMainElement);
filmsPresenter.init(filmsModel);
