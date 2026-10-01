import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { MembershipModal } from './components/layout/MembershipModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { AssistantPage } from './pages/AssistantPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export function App() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <DemoBanner />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/match/:matchId" element={<MatchDetailPage />} />
          <Route path="/match" element={<MatchDetailPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {pathname !== '/assistant' && <Footer />}
      <MembershipModal />
    </>
  );
}
