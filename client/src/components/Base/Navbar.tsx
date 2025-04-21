import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-sm absolute top-0 left-0 w-full flex justify-between px-6">
      <div className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `pb-0 ${isActive ? "border-b-2 border-neutral-500 font-semibold" : "text-gray-500"}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `pb-0 ${isActive ? "border-b-2 border-neutral-500 font-semibold" : "text-gray-500"}`
          }
        >
          Tasks
        </NavLink>
      </div>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  );
}
