import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Courses } from './pages/Courses';
import { Onboarding } from './pages/Onboarding';
import { Profile } from './pages/Profile';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { ScrollToTop } from './components/ScrollToTop';
import { supabase } from './services/supabaseClient';

function AuthRedirects() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    let isMounted = true;

    const handleSession = (isSignedIn: boolean) => {
      const currentPath = window.location.pathname;

      if (isSignedIn && currentPath === '/') {
        navigate('/courses', { replace: true });
      }

      if (!isSignedIn && (currentPath === '/profile' || currentPath === '/onboarding')) {
        navigate('/courses', { replace: true });
      }
    };

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      handleSession(!!data.session);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(!!session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthRedirects />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
