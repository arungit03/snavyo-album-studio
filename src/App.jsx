import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import AlbumSizeGuide from './pages/AlbumSizeGuide';
import AlbumEditor from './pages/AlbumEditor';
import ComingSoon from './pages/ComingSoon';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-snavyo-background text-snavyo-text-main">
        <Header />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/album-size-guide" element={<AlbumSizeGuide />} />
            <Route path="/editor/:projectId" element={<AlbumEditor />} />
            <Route path="/import-psd" element={<ComingSoon label="Import PSD" stage="Stage 9: PSD System" />} />
            <Route path="/exported-albums" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
