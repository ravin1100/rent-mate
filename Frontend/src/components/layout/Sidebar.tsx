import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useHousehold } from "../../contexts/HouseholdContext";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { household } = useHousehold();

  if (!user) return null;

  return (
    <aside className="w-64 bg-white shadow-md h-full overflow-y-auto">
      <div className="py-6 px-3 bg-gradient-to-r from-blue-50 to-white border-b">
        <div className="flex items-center px-2">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user.displayName || 'Welcome'}</p>
            <p className="text-xs font-medium text-gray-500 truncate">{household?.name || 'No Household'}</p>
          </div>
        </div>
      </div>
      <nav className="mt-2 px-2">
        <div className="space-y-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive 
                  ? "bg-blue-100 text-blue-800 font-medium" 
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </NavLink>

          {household ? (
            <>
              <NavLink
                to="/dashboard/chores"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Chores
              </NavLink>
              <NavLink
                to="/dashboard/expenses"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Expenses
              </NavLink>
              <NavLink
                to="/dashboard/calendar"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Calendar
              </NavLink>

              <div className="pt-5 pb-2">
                <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <span className="flex-grow">Household</span>
                  <div className="h-px flex-grow bg-gray-200 ml-2"></div>
                </div>
              </div>
              <NavLink
                to="/household/members"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Members
              </NavLink>
              <NavLink
                to="/household/settings"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Settings
              </NavLink>
            </>
          ) : (
            <>
              <div className="pt-5 pb-2">
                <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <span className="flex-grow">Get Started</span>
                  <div className="h-px flex-grow bg-gray-200 ml-2"></div>
                </div>
              </div>
              <NavLink
                to="/household/create"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                Create Household
              </NavLink>
              <NavLink
                to="/household/join"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Join Household
              </NavLink>
            </>
          )}
        </div>
      </nav>
      <div className="px-3 py-4 mt-6">
        <div className="rounded-md bg-blue-50 p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2 text-xs">
              <p className="text-blue-700 font-medium">Need help?</p>
              <p className="text-blue-600 mt-0.5">Check our support page for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
