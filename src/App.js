import React from 'react';
import './App.css';
import { Box } from '@material-ui/core';
import Header from './features/header/Header';
import Body from './features/main/Body';

function App() {
  return (
    <Box className="App">
      <Header/>
      <Body/>
    </Box>
  );
}

export default App;
