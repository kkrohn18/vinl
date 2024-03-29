import Navbar from './Navbar'
import TransactionList from './components/TransactionList'
import AccountList from './components/AccountList'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import BottomNav from "./components/BottomNav";
import { Route, Routes } from 'react-router-dom';

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
          {/* <TransactionList /> */}
      <BottomNav />
      <Routes>
              <Route path="/transactions" element={<TransactionList />} />
              <Route path="/accounts" element={<AccountList />} />
          </Routes>
      </ThemeProvider>
  );
}
