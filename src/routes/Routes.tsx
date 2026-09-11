import { BrowserRouter, Route, Routes } from "react-router-dom"
import { About } from "../pages/About"
import { Clients } from "../pages/Clients"
import { HeroSection } from "../pages/HeroSection"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { NewSchedule } from "../pages/NewSchedule"
import { Profile } from "../pages/Profile"
import { Register } from "../pages/Register"
import { Schedule } from "../pages/Schedule"

export function SetupNavigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroSection />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />
        <Route path="/agenda" element={<Schedule />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/about" element={<About />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/nova-agenda" element={<NewSchedule />} />
      </Routes>
    </BrowserRouter>
  )
}

export default SetupNavigation
