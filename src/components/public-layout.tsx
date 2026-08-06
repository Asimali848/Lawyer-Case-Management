import { Outlet } from "react-router-dom";

import Footer from "./landing/footer";
import Navbar from "./landing/navbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="relative overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
