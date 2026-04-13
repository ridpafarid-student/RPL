import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import DestinationDetail from './pages/DestinationDetail';
import Destinations from './pages/Destinations';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
