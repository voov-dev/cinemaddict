import { AbstractView } from './abstract-view';

const createShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

class ShowMoreView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createShowMoreTemplate();
  }
}

export default ShowMoreView;
