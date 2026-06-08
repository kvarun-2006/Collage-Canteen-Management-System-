import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/community/:id" element={<CommunityDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
