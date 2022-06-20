import BoardPresenter from './presenter/board-presenter';
import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter.js';
import CommentsModel from './model/comments-model';
import MoviesApiService from './movies-api-service';
import CommentsApiService from './comments-api-service';

const AUTHORIZATION = 'Basic wow42kik480';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const bodyElement = document.querySelector('body');
const pageMainElement = bodyElement.querySelector('.main');
const pageFooterElement = bodyElement.querySelector('.footer');
const filterModel = new FilterModel();
const moviesModel = new MoviesModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));

const filterPresenter = new FilterPresenter(pageMainElement, filterModel, moviesModel);
const boardPresenter = new BoardPresenter(pageFooterElement, pageMainElement, filterModel, moviesModel, commentsModel, bodyElement);

filterPresenter.init();
boardPresenter.init();

moviesModel.init();
