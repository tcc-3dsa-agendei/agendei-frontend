import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HeroSection } from "../pages/HeroSection";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Schedule } from "../pages/Schedule";
import { Clients } from "../pages/Clients";
import { Profile } from "../pages/Profile";
import { NewSchedule } from "../pages/NewSchedule";

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
    );
}

export default SetupNavigation;