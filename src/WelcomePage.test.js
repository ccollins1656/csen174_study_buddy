import React from 'react';
import { render, screen }  from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import WelcomePage from './WelcomePage'

test("Navbar renders correctly", () => {
  // Most of this mess is to because we need to enable cookies - If there were
  // none, you could just use render(<WelcomePage />);
  render(<CookiesProvider><Router><Routes><Route path="*" element={<WelcomePage />} /></Routes></Router></CookiesProvider>);

  const elemAddCourse = screen.getByText("Add Course");
  const elemMessages = screen.getByText("Messages");
  const elemAccountSettings = screen.getByText("Account Settings");

  expect(elemAddCourse).toBeInTheDocument();
  expect(elemMessages).toBeInTheDocument();
  expect(elemAccountSettings).toBeInTheDocument();
})
