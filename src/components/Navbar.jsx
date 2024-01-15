import { Link } from "react-router-dom";
import { logout } from "../app/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  // REDUX STATE
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispath = useDispatch();
  return (
    <>
      <div className="navbar bg-slate-200">
        <div className="mx-auto w-[90%] max-w-7xl flex">
          <div className="flex-1">
            <Link to="/dashboard" className="btn btn-ghost text-xl">
              PrimeSys
            </Link>
          </div>
          {isAuthenticated && user.user.role}
          <div className="flex-none">
            <ul className="menu menu-horizontal px-2 items-center">
              <div className="dropdown dropdown-hover dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-sm m-1">
                  Activities
                </div>
                <ul className="dropdown-content z-[1] menu menu-sm p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link to="/invoice">Invoice</Link>
                  </li>
                  <li>
                    <Link to="/receipt">Receipt</Link>
                  </li>
                  <li>
                    <a>GIRO</a>
                  </li>
                  <li>
                    <a>Xero Transfer</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown dropdown-hover dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-sm m-1">
                  List
                </div>
                <ul className="dropdown-content z-[1] menu menu-sm p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link to="/contact">Contacts</Link>
                  </li>
                  <li>
                    <a>Courses</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown dropdown-hover dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-sm m-1">
                  Setup
                </div>
                <ul className="dropdown-content z-[1] menu menu-sm p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </div>
            </ul>
            <button
              onClick={() => dispath(logout())}
              className="btn btn-sm bg-red-500 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
