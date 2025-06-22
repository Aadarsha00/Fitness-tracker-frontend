"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout, loading } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Workouts",
      link: "/workouts",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleNavItemClick = (link: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(link);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  const handleLogWorkout = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push("/log-workout");
    setIsMobileMenuOpen(false);
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsProfileDropdownOpen(false);
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full">
        <Navbar className="bg-gray-950/90 backdrop-blur-xl border-b border-gray-600/60 shadow-2xl">
          <NavBody>
            <NavbarLogo />
            <div className="flex items-center gap-6">
              <div className="w-24 h-10 bg-gray-800/50 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">Loading...</span>
            </div>
          </NavBody>
        </Navbar>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Navbar className="bg-gray-950/90 backdrop-blur-xl border-b border-gray-600/60 shadow-2xl">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* Log Workout Button */}
                <NavbarButton
                  variant="primary"
                  onClick={handleLogWorkout}
                  className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 border border-pink-400/20 hover:border-pink-400/40"
                >
                  + Log Workout
                </NavbarButton>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 border border-gray-600/70 hover:border-gray-500/80"
                    aria-label="User menu"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-gray-700/50">
                      {getUserInitials()}
                    </div>
                    <span className="text-gray-200 font-medium hidden sm:block">
                      {user?.name}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-300 transition-all duration-300 ${
                        isProfileDropdownOpen ? "rotate-180 text-pink-400" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />

                      {/* Dropdown */}
                      <div className="absolute right-0 mt-3 w-56 bg-gray-950/95 backdrop-blur-xl border border-gray-600/80 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
                        <div className="py-2">
                          <div className="px-6 py-3 border-b border-gray-600/50">
                            <p className="text-sm text-gray-400">
                              Signed in as
                            </p>
                            <p className="text-sm font-medium text-white truncate">
                              {user?.email || user?.name}
                            </p>
                          </div>

                          <button
                            onClick={handleProfile}
                            className="w-full text-left px-6 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-blue-500/10 hover:text-white transition-all duration-200 rounded-lg mx-2 flex items-center gap-3"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile Settings
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-6 py-3 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200 rounded-lg mx-2 flex items-center gap-3"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <NavbarButton
                variant="secondary"
                onClick={handleLogin}
                className="bg-gray-800/80 hover:bg-gray-700/90 border border-gray-600/70 hover:border-gray-500/80 text-gray-200 hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-full"
              >
                Login
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="bg-gray-950/95 backdrop-blur-xl border-t border-gray-600/80"
          >
            <>
              {/* Navigation Items */}
              {navItems.map((item, idx) => (
                <button
                  key={`mobile-link-${idx}`}
                  onClick={() => handleNavItemClick(item.link)}
                  className="relative text-white hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-blue-500/10 py-4 px-6 rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500/70 w-full text-left"
                >
                  <span className="block font-medium">{item.name}</span>
                  {!isAuthenticated && (
                    <span className="text-xs text-gray-400 mt-1">
                      Login required
                    </span>
                  )}
                </button>
              ))}

              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-600/50 mt-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="flex w-full flex-col gap-4 mt-6 px-4">
                    <NavbarButton
                      onClick={handleLogWorkout}
                      variant="primary"
                      className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      + Log Workout
                    </NavbarButton>

                    <NavbarButton
                      onClick={handleProfile}
                      variant="secondary"
                      className="w-full bg-gray-800/80 hover:bg-gray-700/90 border border-gray-600/70 hover:border-gray-500/80 text-gray-200 hover:text-white py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      Profile Settings
                    </NavbarButton>

                    <NavbarButton
                      onClick={handleLogout}
                      variant="secondary"
                      className="w-full text-red-400 border border-red-400/50 hover:bg-red-900/30 hover:border-red-400/70 hover:text-red-300 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      Logout
                    </NavbarButton>
                  </div>
                </>
              ) : (
                <div className="flex w-full flex-col gap-4 px-4 mt-4">
                  <NavbarButton
                    onClick={handleLogin}
                    variant="primary"
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Login
                  </NavbarButton>
                </div>
              )}
            </>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
