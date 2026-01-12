import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CampaignPage from './pages/CampaignPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaign/:id" element={<CampaignPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/:campaignId" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
