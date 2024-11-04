import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthGithub from './pages/Auth/Auth';
import ProfileGithub from './pages/Profile/Profile';

const App = () => {
  return (
    <>
      <Routes>
        {/* Wrap components in JSX */}
        <Route path="/" element={<AuthGithub />} />
        <Route path="/profile" element={<ProfileGithub />} />
      </Routes>
    </>
  );
};

export default App;
