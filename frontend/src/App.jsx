import React from 'react';
import { Container, background } from '@chakra-ui/react';
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from './pages/AuthPage';
import Header from './components/Header';
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./components/LogoutButton";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from './components/CreatePost';
import { useSelector } from 'react-redux';
import SearchPage from './pages/SearchPage';

function App() {
  const isAuthenticated = useRecoilValue(userAtom);
  const modeStatus = useSelector((state) => state.mode.mode)

  const bodyStyle = {
    backgroundColor: modeStatus ? 'black' : '#f5f5f5',

  };


  return (
    <>
      <style>
        {`
          body {
            background-color: ${bodyStyle.backgroundColor}; 
          }
        `}
      </style>

      <Container>
        <Header />
      </Container>


      <Container maxW="700px" className='flex-coloum items-center' >

        <Routes>
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to='/auth' />} />
          <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to='/' />} />
          <Route path="/updateprofile" element={isAuthenticated ? <UpdateProfile /> : <Navigate to='/auth' />} />
          <Route path="/:username" element={!isAuthenticated ? <AuthPage /> : <UserPage />} />
          <Route path="/:username/post/:postId" element={!isAuthenticated ? <Navigate to="/auth" /> : <PostPage />} />
          <Route path="/searchpage" element={!isAuthenticated ? <Navigate to="/auth" /> : <SearchPage />} />
        </Routes>

        {isAuthenticated && <LogoutButton />}
        {isAuthenticated && <CreatePost />}
      </Container>
    </>
  );
}

export default App;
