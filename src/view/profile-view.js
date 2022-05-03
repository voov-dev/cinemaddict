import { AbstractView } from './abstract-view';

const createProfileTemplate = () => (
  `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

class ProfileView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createProfileTemplate();
  }
}

export default ProfileView;
