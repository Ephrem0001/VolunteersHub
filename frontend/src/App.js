import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Admin from "./pages/admin/AdminLogin";
import VolunteerDashboard from "./pages/users/VolunteerDashboard";
import EventDetailsPage from "./pages/users/EventDetailsPage";
import HomePage from "./pages/HomePage";
import NgoBlocked from "./pages/ngo/NgoBlocked";
import Login from "./pages/users/Login";
import UserBlocked from "./pages/users/UserBlocked";
import PrivateRoute from "./components/Protected/PrivateRoute";
import NgoRoute from "./components/Protected/ngoRoute";
import AdminRoute from "./components/Protected/adminRoute";
import RegisterVolunteer from "./pages/users/RegisterVolunteer";
import RegisterNGO from "./pages/ngo/RegisterNGO";
import NgoHome from "./pages/ngo/NgoHome"
import ManageNGO from "./pages/admin/ManageNGO"
import ManageVolunteer from "./pages/admin/ManageVolunteer"
import ApprovedEvents from "./pages/admin/ApprovedEvents"
import RejectedEvents from "./pages/admin/RejectedEvents"
import AdminRegister from "./pages/admin/AdminRegister"
import ApproveEvents from "./pages/admin/ApproveEvents"
import CreateEvent from "./pages/ngo/CreateEvent"
import NgoDashboard from "./pages/ngo/NgoDashboard.jsx";
import TermsAndConditions from "./pages/ngo/Termsandcondition.jsx";
import Privacypolicy from "./pages/ngo/Privacypolicy.jsx";
import VerifyEmail from "./pages/VerifyEmail";
import TrackVolunteers from "./pages/users/TrackVolunteers.jsx";
import { AuthProvider } from "./context/AuthContext";
import MyAnnouncements from "./pages/ngo/MyAnnouncements.jsx"; // Correct import path
import Profile from "./pages/users/profile.jsx";
import ManageEvents from "./pages/ngo/ManageEvents.jsx";
import Dashboard from "./components/Analytics/Dashboard.js";
import Terms from "./pages/users/Terms.jsx";
import SuccessStories from "./pages/SuccessStories.jsx";
import ForgotPassword from "./pages/users/ForgotPassword.jsx";
import ResetPassword from "./pages/users/ResetPassword.jsx";
// import ManageEvents from "./pages/ngo/ManageEvents.jsx";
const App = () => {
  return (
    <AuthProvider>

   
    <Router>
      <Routes>

        {/* Default Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Home Routes */}
        <Route path="/ngo" element={<NgoHome />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />


        

        {/* Login Routes */}
     

        <Route path="/users/track-volunteers" element={<TrackVolunteers/>} />
        {/* <Route path="/ngo/manage-events" element={<ManageEvents/>} /> */}
        
      
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        {/* Register Routes */}
        <Route path="/register-admin" element={<AdminRegister />} />
        <Route path="/register-volunteer" element={<RegisterVolunteer />} />
        <Route path="/register-ngo" element={<RegisterNGO />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* User/Volunteer Protected Routes */}
        <Route path="/volunteerdashboard" element={<VolunteerDashboard />} />
        <Route path="/terms" element={<Terms/>} />
        <Route path="/event/:eventId" element={<EventDetailsPage />} />
        <Route path="/user/UserBlocked" element={<UserBlocked />} />
        <Route path="/success-stories" element={<SuccessStories />} />

        
        {/* Admin Protected Routes */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
         <Route path="/admin-dashboard/approve-events" element={<AdminRoute role="admin"><ApproveEvents/></AdminRoute> }/>
        
        <Route path="/admin-dashboard/manage-ngo" element={ <AdminRoute role="admin"><ManageNGO /></AdminRoute> }/>
        <Route path="/admin-dashboard/ManageVolunteer" element={ <AdminRoute role="admin"><ManageVolunteer/></AdminRoute> }/>
        <Route path="/admin-dashboard/approved-events" element={ <AdminRoute role="admin"><ApprovedEvents/></AdminRoute> }/>
        <Route path="/admin-dashboard/rejected-events" element={ <AdminRoute role="admin"><RejectedEvents/></AdminRoute> }/>


        {/* Ngo Protected Routes */}
        {/* <Route path="/ngo/ngodashboard" element={<NgoRoute role="ngo"><NgoDashboard /></NgoRoute>} />   
              */}
        <Route path="/ngo/ngodashboard" element={ <NgoDashboard />} /> 
        <Route path="/analytics/dashboard" element={ <Dashboard />} /> 
        <Route path="/ngo/manage-events" element={ <ManageEvents  />} /> 
        <Route path="/ngo/create-event" element={<CreateEvent />}/>
        <Route path="/ngo/blocked-ngo" element={<NgoBlocked />}/>
        <Route path="/ngo/termsandcondition" element={<TermsAndConditions/>}/>
        <Route path="/ngo/privacypolicy" element={<Privacypolicy/>}/>
        <Route path="/my-announcements" element={<MyAnnouncements />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
