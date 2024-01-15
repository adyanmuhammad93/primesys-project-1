import React from "react";
import Stepper from "../components/Stepper";

const Home = () => {
  console.log(`SERVER PORT: ${import.meta.env.VITE_SERVER_PORT}`);
  return (
    <>
      <div className="mx-auto w-full max-w-xl my-4 rounded shadow">
        <Stepper />
      </div>
    </>
  );
};

export default Home;
