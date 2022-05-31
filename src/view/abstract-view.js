export class AbstractView {
  #element;

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }

    this.#element = null;
  }

  get #template() {
    throw new Error('AbstractView method not implemented: getTemplate');
  }

  removeElement() {
    this.#element = null;
  }
}
