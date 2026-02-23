
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCampsites } from './features/campsites/campsitesSlice';
import { fetchOverlooks } from './features/overlooks/overlooksSlice';
import { fetchHikes } from './features/hikes/hikesSlice';
import { fetchCampsiteComments } from './features/campsites/campsitesCommentsSlice';
import { fetchHikeComments } from './features/hikes/hikesCommentsSlice';
import { fetchOverlookComments } from './features/overlooks/overlooksCommentsSlice';
import { Routes, Route } from 'react-router-dom';
import NavigationBar from "./components/NavigationBar";
import Home from './pages/HomePage';
import AddLocationsPage from './pages/AddLocationsPage';
import HikingTrailsPage from './pages/HikingTrailsPage';
import CampingSpotsPage from './pages/CampingSpotsPage';
import OverlooksPage from './pages/OverlooksPage';
import HikingDetailPage from './pages/HikingDetailPage';
import CampingDetailPage from './pages/CampingDetailPage';
import OverlookDetailPage from './pages/OverlookDetailPage';
import Footer from './components/Footer';

import './App.css';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCampsites());
    dispatch(fetchOverlooks());
    dispatch(fetchHikes());
    dispatch(fetchCampsiteComments());
    dispatch(fetchHikeComments());
    dispatch(fetchOverlookComments())
  }, [dispatch]);
  
  return (
    <>
      
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='add-locations' element={<AddLocationsPage/>}/>
        <Route path='hiking-trails' element={<HikingTrailsPage />}/>
        <Route path='hiking-trails/:id' element={<HikingDetailPage />}/>
        <Route path='camping-spots' element={<CampingSpotsPage />}/>
        <Route path='camping-spots/:id' element={<CampingDetailPage />}/> 

        <Route path='scenic-overlooks' element={<OverlooksPage />}/>
        <Route path='scenic-overlooks/:id' element={<OverlookDetailPage />}/>
      </Routes>
      <Footer fixed="bottom" />
    </>
      
  );
}

export default App;
