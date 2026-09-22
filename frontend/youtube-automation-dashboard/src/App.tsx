import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import ChannelManager from './components/ChannelManager';
import CampaignManager from './components/CampaignManager';
import Analytics from './components/Analytics';
import Trends from './components/Trends';
import Settings from './components/Settings';
import Layout from './components/Layout';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#1a1a2e',
    },
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/channels" element={<ChannelManager />} />
            <Route path="/campaigns" element={<CampaignManager />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
