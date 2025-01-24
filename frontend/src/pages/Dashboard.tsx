import { useState } from "react";
import logo from "../assets/icon.png";
const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex justify-between items-center px-5 py-2">
        <img src={logo} alt="logo" />
        <h1>Dashboard</h1>
        <button className="underline text-blue-400">sign Out</button>
      </div>
      <div className="  w-full ">
        <div className="border border-gray-300 px-5 py-4  m-5">
          <h1 className="text-xl font-bold">Welcome USER</h1>
          <h2>hereisyour@email.com</h2>
        </div>
      </div>
      <div className="  w-full ">
        <div className=" border border-gray-300 px-5 py-4 gap-4  m-5 ">
          <div className="flex justify-between items-center px-8">
            <h1>NOTES</h1>
            <button onClick={handleButtonClick}>Add Notes</button>
          </div>
          {isVisible === true ? (
            <div className="absolute flex items-center justify-center left-0 top-0  h-screen w-screen bg-black/20">
              <div className="bg-white flex flex-col gap-2 min-w-sm lg:min-w-xl p-5 ">
                <div className="flex justify-end">
                  <button
                    onClick={handleButtonClick}
                    className="border border-gray-300 py-1 px-2 rounded"
                  >
                    X
                  </button>
                </div>
                <textarea
  placeholder="TITLE"
  className="w-full placeholder:text-2xl placeholder-gray-400 focus:placeholder-transparent p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-28 resize-none"
></textarea>

<textarea
  placeholder="DESCRIPTION"
  className="w-full placeholder:text-2xl placeholder-gray-400 focus:placeholder-transparent p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 resize-none"
></textarea>

                <div className="flex justify-end">
                  <button className="border p-2 ">Add</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3 rounded-lg "></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
