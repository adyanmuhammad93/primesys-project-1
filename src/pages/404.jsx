import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Page not found.</h1>
      <p>
        back <Link to="/dashboard">Home</Link>
      </p>
    </div>
  );
};

export default NotFound;
