import UserRankView from './view/user-rank-view';
import BoardPresenter from './presenter/board-presenter';
import MoviesStaticticsView from './view/movies-statistics-view';
import { render } from './framework/render';
import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter.js';
import CommentsModel from './model/comments-model';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const filterModel = new FilterModel();
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const boardPresenter = new BoardPresenter(siteFooterElement, siteMainElement, filterModel, moviesModel, commentsModel);

render(new UserRankView(), siteHeaderElement);
render(new MoviesStaticticsView(), siteFooterStatisticsElement);

filterPresenter.init();
boardPresenter.init();
