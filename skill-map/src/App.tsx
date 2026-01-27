import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import AuthoPage from './pages/AuthoPage/AuthoPage';
import './App.css'
import { createContext, useState, type Dispatch, type SetStateAction } from 'react';
import type { ApiError } from './types';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import MainPage from './pages/MainPage/MainPage';
import NavBar from './components/NavBar';
import RoadmapPage from './pages/RoadmapPage/RoadmapPage';


const MainLayout = () => {
  return (
    <>
    <NavBar/>
     <main style={{ paddingTop:'56px' }}>
      <Outlet />
     </main>
    </> )
};

export const AppContext = createContext<{
  error: ApiError
  setError: Dispatch<SetStateAction<ApiError>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
} | null>(null)

function App() {
  const [error, setError] = useState<ApiError>({isError: false, detail: undefined})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const values = {error, isLoading, setError, setIsLoading}
  return (
    <AppContext.Provider value={values}>
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<AuthoPage />} />
              <Route path="/reg" element={<RegisterPage />} />
              <Route element={<MainLayout/>}>
                 <Route path="/" element={<MainPage/>} />
                 <Route path="/roadmap" element={<RoadmapPage/>} />
              </Route>
          </Routes>
      </BrowserRouter>
    </AppContext.Provider>
      
  );
}

export default App;