interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const menuItems = ["Home", "Upload", "My Gallery", "Login/Signup"];

  return (
    <nav className="border-b-4 border-black bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate("Home")}
            className="text-3xl font-bold text-black cursor-pointer border-2 border-black px-4 py-2"
          >
            PhotoCloud
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item)}
                className={`px-5 py-2 font-mono text-sm font-medium border-2 border-black transition-colors ${
                  currentPage === item
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden border-2 border-black px-3 py-2 bg-white">
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-black"></div>
              <div className="w-6 h-0.5 bg-black"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
