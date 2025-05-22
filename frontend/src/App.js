"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import Admin from "./pages/admin/AdminLogin.jsx"
import VolunteerDashboard from "./pages/users/VolunteerDashboard.jsx"
import EventDetailsPage from "./pages/users/EventDetailsPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import NgoBlocked from "./pages/ngo/NgoBlocked.jsx"
import Login from "./pages/users/Login.jsx"
import UserBlocked from "./pages/users/UserBlocked.jsx"
import AdminRoute from "./components/Protected/adminRoute.jsx"
import RegisterVolunteer from "./pages/users/RegisterVolunteer.jsx"
import RegisterNGO from "./pages/ngo/RegisterNGO.jsx"
import NgoHome from "./pages/ngo/NgoHome.jsx"
import ManageNGO from "./pages/admin/ManageNGO.jsx"
import ManageVolunteer from "./pages/admin/ManageVolunteer.jsx"
import ApprovedEvents from "./pages/admin/ApprovedEvents.jsx"
import RejectedEvents from "./pages/admin/RejectedEvents.jsx"
import AdminRegister from "./pages/admin/AdminRegister.jsx"
import ApproveEvents from "./pages/admin/ApproveEvents.jsx"
import CreateEvent from "./pages/ngo/CreateEvent.jsx"
import NgoDashboard from "./pages/ngo/NgoDashboard.jsx.jsx"
import TermsAndConditions from "./pages/ngo/Termsandcondition.jsx"
import Privacypolicy from "./pages/ngo/Privacypolicy.jsx"
import TrackVolunteers from "./pages/users/TrackVolunteers.jsx"
import { AuthProvider } from "./context/AuthContext.js"
import MyAnnouncements from "./pages/ngo/MyAnnouncements.jsx" // Correct import path
import ManageEvents from "./pages/ngo/ManageEvents.jsx"
import Dashboard from "./components/Analytics/Dashboard.js"
import Terms from "./pages/users/Terms.jsx"
import SuccessStories from "./pages/SuccessStories.jsx"
import ForgotPassword from "./pages/users/ForgotPassword.jsx"
import ResetPassword from "./pages/users/ResetPassword.jsx"
import EditEvent from "./pages/ngo/EditEvent.jsx"
import Teams from "./pages/ngo/Teams.jsx"
import ContactMessages from "./pages/admin/ContactMessages.jsx"
import AdminLogin from "./pages/admin/AdminLogin.jsx"
import AdminManagement from "./pages/admin/AdminManagement.jsx"
// import ManageEvents from "./pages/ngo/ManageEvents.jsx";
import { useEffect } from "react"
import { showUpdateNotification, showInstallPrompt } from "./pwa-utils"

const App = () => {
  useEffect(() => {
    showUpdateNotification()
    showInstallPrompt()
  }, [])

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Home Routes */}
          <Route path="/ngo" element={<NgoHome />} />
          <Route path="/admin" element={<Admin />} />

          {/* Login Routes */}
          <Route path="/users/track-volunteers" element={<TrackVolunteers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-management" element={<AdminManagement />} />

          {/* Register Routes */}
          <Route path="/register-admin" element={<AdminRegister />} />
          <Route path="/register-volunteer" element={<RegisterVolunteer />} />
          <Route path="/register-ngo" element={<RegisterNGO />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* User/Volunteer Protected Routes */}
          <Route path="/volunteerdashboard" element={<VolunteerDashboard />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/event/:eventId" element={<EventDetailsPage />} />
          <Route path="/user/UserBlocked" element={<UserBlocked />} />
          <Route path="/success-stories" element={<SuccessStories />} />

          {/* Admin Protected Routes */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route
            path="/admin-dashboard/approve-events"
            element={
              <AdminRoute role="admin">
                <ApproveEvents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/contact-messages"
            element={
              <AdminRoute role="admin">
                <ContactMessages />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/manage-ngo"
            element={
              <AdminRoute role="admin">
                <ManageNGO />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/ManageVolunteer"
            element={
              <AdminRoute role="admin">
                <ManageVolunteer />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/approved-events"
            element={
              <AdminRoute role="admin">
                <ApprovedEvents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/rejected-events"
            element={
              <AdminRoute role="admin">
                <RejectedEvents />
              </AdminRoute>
            }
          />

          {/* Ngo Protected Routes */}
          <Route path="/ngo/ngodashboard" element={<NgoDashboard />} />
          <Route path="/ngo/teams" element={<Teams />} />
          <Route path="/analytics/dashboard" element={<Dashboard />} />
          <Route path="/ngo/manage-events" element={<ManageEvents />} />
          <Route path="/ngo/edit-event/:id" element={<EditEvent />} />
          <Route path="/ngo/create-event" element={<CreateEvent />} />
          <Route path="/ngo/blocked-ngo" element={<NgoBlocked />} />
          <Route path="/ngo/termsandcondition" element={<TermsAndConditions />} />
          <Route path="/ngo/privacypolicy" element={<Privacypolicy />} />
          <Route path="/my-announcements" element={<MyAnnouncements />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
