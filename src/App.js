import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from './auth/login/Login';
import SignUp from './auth/SignUp/SignUp';
import AdminView from './admin/AdminView';
import './App.css'
import Profile from './common/Profile/Profile';
import SearchPage from './common/SearchPage/SearchPage';
import ForgotPassword from './auth/forgorPassword/ForgotPassword';
import TwoAuth from './auth/TwoAuth/TwoAuth';
import CheckEmail from './auth/CheckEmail';
import CustomAppBar from './components/CustomAppBar/CustomAppBar';
import Protected from './auth/ProtectedRoute';
import ResetPassword from './auth/resetPassword/resetPassword';
import Page404 from './common/Page404';
import PdfViewer from './common/PDFViewer/PDFViewer';
import ChatBot from './components/Chatbot/Chatbot';
// import PdfViewer from './common/PDFViewer/PDFViewer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomAppBar />} >
            <Route index element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-view" element={<Protected><AdminView /></Protected>} />
            <Route path="/profile-page" element={<Protected><Profile /> </Protected>} />
            <Route path="/two-auth" element={<TwoAuth />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/pdf-viewer" element={<PdfViewer />} />
            {/* <Route path="/dev" element={<ChatBot />} /> */}
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
