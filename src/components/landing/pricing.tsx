import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Pricingplan = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto h-full w-full max-w-screen-2xl px-4 pb-18 sm:px-8 md:px-10 lg:px-10 lg:pb-28">
      <div className="flex w-full flex-col items-center justify-center gap-12 text-center md:gap-16">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center gap-4 text-black">
          <p className="font-bold text-3xl sm:text-4xl">Pricing Plan</p>
          <hr className="h-1 w-16 rounded-full bg-primary sm:w-20" />
          <p className="max-w-2xl font-semibold text-base sm:text-lg md:text-xl">
            Design your beautiful Elementor pricing table with a colorful background color.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
          {/* Free Plan */}
          <div className="w-full max-w-full rounded-xl border-2 border-primary p-6 text-black drop-shadow-xl duration-500 hover:scale-105 sm:p-8 md:w-[50%] md:p-10 lg:w-[70%]">
            <p className="mb-5 font-bold text-2xl sm:text-3xl">Basic</p>
            <div className="rounded-lg bg-primary py-3 text-center">
              <span className="font-bold text-3xl text-white sm:text-4xl">Free</span>
            </div>
            <div className="flex flex-col gap-4 py-8 font-semibold text-base sm:py-10 sm:text-lg md:text-xl">
              <p>No Usage Limit</p>
              <p>2 Week free trial</p>
              <p>No Credit Card Required</p>
              <p>300 GB Bandwidth</p>
              <p>15 Email Account</p>
              <p>Enhanced Security</p>
              <p>00 Mysql Databases</p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="my-4 w-[200px] rounded-md border-2 border-primary py-4 font-medium text-white transition hover:scale-105 hover:cursor-pointer hover:border-primary hover:bg-white hover:text-primary sm:my-6 sm:py-6"
            >
              Order Now
            </Button>
          </div>

          {/* Paid Plan */}
          <div className="w-full max-w-full rounded-xl border border-primary bg-primary p-6 drop-shadow-xl duration-500 hover:scale-105 sm:p-8 md:w-[50%] md:p-10 lg:w-[70%]">
            <p className="mb-5 font-bold text-2xl text-white sm:text-3xl">Paid</p>
            <div className="flex items-center justify-center rounded-lg bg-white py-3">
              <span className="font-bold text-3xl text-primary sm:text-4xl">
                <span className="text-lg sm:text-xl">$</span>20 /mo
              </span>
            </div>
            <div className="flex flex-col gap-4 py-8 font-semibold text-base text-white sm:py-10 sm:text-lg md:text-xl">
              <p>$180 Per Year (save 25%)</p>
              <p>1 Domain Name</p>
              <p>300 GB Bandwidth</p>
              <p>15 Email Account</p>
              <p>Enhanced Security</p>
              <p>00 Mysql Databases</p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="my-4 w-[200px] rounded-md border-2 border-primary bg-white py-4 font-medium text-primary transition hover:scale-105 hover:cursor-pointer hover:border-white hover:text-white sm:my-6 sm:py-6"
            >
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricingplan;
