import { AbstractView } from './abstract-view';

const createProfileTemplate = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating ${rating ? '' : 'visually-hidden'}">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

class ProfileView extends AbstractView {
  constructor(rating) {
    super();
    this.rating = rating;
  }

  getTemplate() {
    return createProfileTemplate(this.rating);
  }
}

export default ProfileView;
