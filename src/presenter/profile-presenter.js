import { render } from '../render';
import ProfileView from '../view/profile-view.js';

export default class ProfilePresenter {
  init(profileContainer, rating) {
    render(new ProfileView(rating), profileContainer);
  }
}
