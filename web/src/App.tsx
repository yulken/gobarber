import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import AppProvider from './hooks';
import GlobalStyle from './styles/global';

const App: React.FC = () => (
  <Router>
    <AppProvider />
    <Routes />
    <GlobalStyle />
  </Router>
);

export default App;
