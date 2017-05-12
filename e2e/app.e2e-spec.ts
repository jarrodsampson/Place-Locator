import { FindPlacesAppPage } from './app.po';

describe('find-places-app App', () => {
  let page: FindPlacesAppPage;

  beforeEach(() => {
    page = new FindPlacesAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
