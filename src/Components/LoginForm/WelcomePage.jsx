// WelcomePage.jsx
import React from 'react';
import { useSessionAuth } from './useSessionAuth.js';
import Layout from './Layout.jsx';

const WelcomePage = () => {
    useSessionAuth();

    return (
        <Layout>
            <h1>Welcome!</h1>
            <p>This is the home page for Study Buddy. Select an option from the sidebar.</p>
        </Layout>
    );
};

export default WelcomePage;
