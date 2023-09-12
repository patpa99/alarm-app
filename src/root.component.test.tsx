/* eslint-disable node/no-unpublished-import */
import React from 'react';
import {cleanup, render, screen, within} from '@testing-library/react';
// eslint-disable-next-line node/no-extraneous-import
import 'whatwg-fetch';
import Root from './root.component';

describe('Alarm Tests', () => {
  // To render the alarm modal before each test
  beforeEach(() => {
    render(<Root />);
  });

  // To unmounts React trees that were mounted with render after each test
  afterEach(() => {
    cleanup;
  });

  it('TEST 1 - Check the presence of the closing cross', () => {
    const {getByText} = within(screen.getByTestId('closingCross'));
    expect(getByText('×')).toBeTruthy();
  });

  it('TEST 2 - Check the presence of the "Alarms" title in the alarm modal', () => {
    const {getByText} = within(screen.getByTestId('alarmTitleDiv'));
    expect(getByText('Alarms')).toBeTruthy();
  });

  it('TEST 3 - Check the presence of the search bar container', () => {
    expect(screen.getByTestId('searchBarDiv')).toBeTruthy();
  });

  it('TEST 4 - Check the presence of the alarm table', () => {
    expect(screen.getByTestId('alarmTable')).toBeTruthy();
  });
});
