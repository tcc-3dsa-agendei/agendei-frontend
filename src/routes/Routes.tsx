import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Booking } from "@/pages/Booking"
import { Clients } from "@/pages/Clients"
import { HeroSection } from "@/pages/HeroSection"
import { Home } from "@/pages/Home"
import { Login } from "@/pages/Login"
import { NewSchedule } from "@/pages/NewSchedule"
import { Profile } from "@/pages/Profile"
import { Register } from "@/pages/Register"
import { Schedule } from "@/pages/Schedule"
import { Services } from "@/pages/Services"

export function SetupNavigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/agenda" element={<Schedule />} />
          <Route path="/nova-agenda" element={<NewSchedule />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/agendar" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<Navigate to="/home" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default SetupNavigation
