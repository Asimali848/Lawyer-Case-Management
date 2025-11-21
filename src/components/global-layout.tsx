import { Outlet } from "react-router-dom";

import MaxWidthWrapper from "./max-width-wrapper";
import Navbar from "./navbar";

const GlobalLayout = () => {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-start justify-start overflow-hidden">
      <Navbar />
      <div className="mt-16 w-full p-5 md:h-full md:p-5">
        <MaxWidthWrapper>
          <Outlet />
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default GlobalLayout;
