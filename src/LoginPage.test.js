import React from 'react';
import { render, screen, waitFor }  from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router, MemoryRouter, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import LoginPage from './LoginPage'


test('Core Elements Present', () => {
  render(<CookiesProvider><Router><Routes><Route path="*" element={<LoginPage />} /></Routes></Router></CookiesProvider>);
  // render(<CookiesProvider><LoginPage /></CookiesProvider>)

  expect(screen.getByText(/Study Helper/)).toBeInTheDocument();

  const elemEmailField = screen.getByPlaceholderText(/email/i);
  const elemSubmit = screen.getByText('Login');

  expect(elemEmailField).toBeInTheDocument();
  expect(elemSubmit).toBeInTheDocument();
})

test('Submit Button on Empty Email Shows Error Message', async () => {
  const user = userEvent.setup();
  render(<CookiesProvider><Router><Routes><Route path="*" element={<LoginPage />} /></Routes></Router></CookiesProvider>);
  // render(<CookiesProvider><LoginPage /></CookiesProvider>)

  const elemSubmit = screen.getByText('Login');
  await user.click(elemSubmit);

  const elemError = screen.getByText(/scu email/i);
  expect(elemError).toBeInTheDocument();
})

test('Submit Button on Non-SCU Email Shows Error Message', async () => {
  const user = userEvent.setup();
  render(<CookiesProvider><Router><Routes><Route path="*" element={<LoginPage />} /></Routes></Router></CookiesProvider>);
  // render(<CookiesProvider><LoginPage /></CookiesProvider>)

  const elemEmailField = screen.getByPlaceholderText(/email/i);
  await user.click(elemEmailField);
  await user.keyboard('intruder@fakesite.com');

  const elemSubmit = screen.getByText('Login');
  await user.click(elemSubmit);

  const elemError = screen.getByText(/please use/i);
  expect(elemError).toBeInTheDocument();
})

test('Submitting an @scu.edu Email is Accepted', async () => {
  const user = userEvent.setup();
  render(<CookiesProvider><Router><Routes><Route path="*" element={<LoginPage />} /></Routes></Router></CookiesProvider>);
  // render(<CookiesProvider><LoginPage /></CookiesProvider>)

  const elemEmailField = screen.getByPlaceholderText(/email/i);
  await user.type(elemEmailField, 'hevers@scu.edu');
  expect(elemEmailField).toHaveValue('hevers@scu.edu');

  const elemSubmit = screen.getByText('Login');
  await user.click(elemSubmit);
  
  const elemError = screen.getByText(/success/i);
  expect(elemError).toBeInTheDocument();
})

test('Submitting an @scu.edu Email Redirects to /welcome', async () => {
  const user = userEvent.setup();
  render(
    <CookiesProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/welcome" element={<div />} />
        </Routes>
      </MemoryRouter>
    </CookiesProvider>
  );

  // Enter a valid @scu.edu email and hit submit
  const elemHeader = screen.getByText(/study helper login/i);
  const elemEmailField = screen.getByPlaceholderText(/email/i);
  await user.type(elemEmailField, 'hevers@scu.edu');
  expect(elemEmailField).toHaveValue('hevers@scu.edu');

  const elemSubmit = screen.getByText('Login');
  await user.click(elemSubmit);
  
  // We should be on a different page now - all key elements of this page gone
  expect(elemEmailField).not.toBeInTheDocument();
  expect(elemSubmit).not.toBeInTheDocument();
  expect(elemHeader).not.toBeInTheDocument();
})
