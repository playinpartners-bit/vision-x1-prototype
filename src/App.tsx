import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { MembershipModal } from './components/layout/MembershipModal';
import { HomePage } from './pages/HomePage';
import { MatchCenterPage } from './pages/MatchCenterPage';
import { MatchPage } from './pages/MatchPage';
import { TrackRecordPage } from './pages/TrackRecordPage';
import { MyVisionPage } from './pages/MyVisionPage';
import { AssistantPage } from './pages/AssistantPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LandingPage } from './pages/LandingPage';
import { AccountModal } from './components/layout/AccountModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export function App() {
  const { pathname } = useLocation();
  // The acquisition landing page runs without the app nav/footer to keep one clear path.
  const isLanding = pathname === '/welcome';
  return (
    <>
      <ScrollToTop />
      <DemoBanner />
      {!isLanding && <Nav />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/matches" element={<MatchCenterPage />} />
          <Route path="/match/:matchId" element={<MatchPage />} />
          <Route path="/track-record" element={<TrackRecordPage />} />
          <Route path="/me" element={<MyVisionPage />} />
          {/* legacy routes from the first prototype */}
          <Route path="/dashboard" element={<Navigate to="/me" replace />} />
          <Route path="/match" element={<Navigate to="/matches" replace />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {pathname !== '/assistant' && !isLanding && <Footer />}
      <MembershipModal />
      <AccountModal />
    </>
  );
}
