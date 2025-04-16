import React from 'react';
import BikeRentalDashboard from './components/BikeRentalDashboard';
// 引入 MUI 主题
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f6fa',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="w-full h-full">
        <BikeRentalDashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
