import { AppComponent } from './app.component';
import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';

describe('AppComponent', () => {
  beforeEach(async () => {
    await render(AppComponent);
  });

  it(`should have as title 'no-styles-angular'`, () => {
    expect(screen.getByText('Test:')).toBeInTheDocument();
  });
});
