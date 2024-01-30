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

function App() {
  const isAuthenticated = useRecoilValue(userAtom);
  const modeStatus = useSelector((state) => state.mode.mode)
  const filterStatus = useSelector((state) => state.mode.filter)

  const bodyStyle = {
    backgroundColor: modeStatus ? 'black' : '#f5f5f5',
    filter: filterStatus ? 'blur(5px)' : 'none', // Apply blur if filterStatus is true
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


      <Container maxW="700px" style={{ filter: bodyStyle.filter }} className='flex-coloum items-center' >

        <Routes>
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to='/auth' />} />
          <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to='/' />} />
          <Route path="/updateprofile" element={isAuthenticated ? <UpdateProfile /> : <Navigate to='/auth' />} />
          <Route path="/:username" element={!isAuthenticated ? <AuthPage /> : <UserPage />} />
          <Route path="/:username/post/:postId" element={<PostPage />} />
        </Routes>

        {isAuthenticated && <LogoutButton />}
        {isAuthenticated && <CreatePost />}
      </Container>
    </>
  );
}

export default App;
