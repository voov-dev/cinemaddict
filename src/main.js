import { render } from './render';
import MainNavigationView from './view/main-navigation-view';
import SortView from './view/sort-view';
import ProfileView from './view/profile-view';
import FilmsPresenter from './presenter/films-presenter';

const pageHeaderElement = document.querySelector('.header');
const pageMainElement = document.querySelector('.main');

render(new ProfileView(), pageHeaderElement, 'beforeend');
render(new MainNavigationView(), pageMainElement);
render(new SortView(), pageMainElement);

const filmsPresenter = new FilmsPresenter(pageMainElement);
filmsPresenter.init();
