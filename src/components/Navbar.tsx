
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { fetchApi } from '@/utils/apiHelper';
import { useToast } from '@/hooks/use-toast';
import { clearAuthData, getAuthToken, isAuthenticated } from '@/utils/authUtils';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  userId: number;
  FirstName: string;
  LastName: string;
  email: string;
  role: number;
}

interface MenuItem {
  RoleWiseMenuID: number;
  RoleID: number;
  MenuID: number;
  IsLandingPage: boolean;
  Status: string;
  Menu: {
    MenuName: string;
    DisplayName: string;
    IsInternalScreen: boolean;
    URL: string;
  };
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (isAuthenticated()) {
        try {
          const token = getAuthToken();
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
            
            // Now fetch menu items based on role
            if (data.role) {
              fetchRoleMenuItems(data.role);
            }
          } else {
            // If token is invalid, clear auth data
            clearAuthData();
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setLoading(false);
    };

    checkAuthentication();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRoleMenuItems = async (roleId: number) => {
    try {
      const items = await fetchApi<MenuItem[]>(`http://localhost:3000/api/admin/access/roleWiseMenu/Menus/${roleId}`);
      // Filter to only show menu items where IsInternalScreen is true
      const filteredItems = items.filter(item => item.Menu.IsInternalScreen === false);
      setMenuItems(filteredItems);
      console.log('Menu items fetched:', filteredItems);
    } catch (error) {
      console.error('Error fetching role menu items:', error);
      // Fallback to empty menu items if API call fails
      setMenuItems([]);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    clearAuthData();
    setUserProfile(null);
    setMenuItems([]);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  // Enhanced styles for better readability
  const navLinkClasses = "text-gray-800 hover:text-primary transition-colors font-medium px-1";
  const activeNavLinkClasses = "text-primary font-semibold border-b-2 border-primary";
  
  // Determine if we should show role-based menu or default menu
  const shouldShowRoleMenu = userProfile && menuItems.length > 0;
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-white/95 backdrop-blur shadow-md py-4' : 'bg-transparent py-4'}`}>
      <div className="container-custom flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <span className="text-2xl font-display font-bold text-teal-700">Travel<span className="text-accent">Ease</span></span>
        </NavLink>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex space-x-10 items-center mx-auto">
          {shouldShowRoleMenu ? (
            // Dynamic Role-based Menu
            menuItems.map((item) => (
              <NavLink 
                key={item.RoleWiseMenuID}
                to={item.Menu.URL} 
                className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}
              >
                {item.Menu.DisplayName}
              </NavLink>
            ))
          ) : 
          (
            // Default Menu for regular users
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses} end>
                Home
              </NavLink>
              <NavLink to="/custom-trip" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>
                Custom Trip
              </NavLink>
              <NavLink to="/packages" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>
                Packages & Tours
              </NavLink>
            </>
          )
          }
        </nav>

        {/* Login Button or User Profile - Right Side */}
        <div className="hidden md:block">
          {!loading && (
            userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Avatar className="h-8 w-8 bg-teal-100">
                    <AvatarFallback className="text-teal-700">
                      {userProfile.FirstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{userProfile.FirstName}</span>
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700" onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink to="/login" className="btn-outline">
                Log In
              </NavLink>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 hover:text-primary p-2 rounded-md">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white/95 backdrop-blur absolute w-full shadow-lg py-4 px-4 border-t border-gray-100">
          <div className="flex flex-col space-y-5">
            {shouldShowRoleMenu ? (
              // Dynamic Role-based Menu for Mobile
              menuItems.map((item) => (
                <NavLink 
                  key={item.RoleWiseMenuID}
                  to={item.Menu.URL} 
                  className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}
                  onClick={toggleMenu}
                >
                  {item.Menu.DisplayName}
                </NavLink>
              ))
            ) : (
              // Default Menu for Mobile
              <>
                <NavLink to="/" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses} onClick={toggleMenu} end>
                  Home
                </NavLink>
                <NavLink to="/custom-trip" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses} onClick={toggleMenu}>
                  Custom Trip
                </NavLink>
                <NavLink to="/packages" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses} onClick={toggleMenu}>
                  Packages & Tours
                </NavLink>
              </>
            )}
            {!loading && (
              userProfile ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <Avatar className="h-8 w-8 bg-teal-100">
                      <AvatarFallback className="text-teal-700">
                        {userProfile.FirstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{userProfile.FirstName} {userProfile.LastName}</span>
                  </div>
                  <NavLink to="/profile" className="pl-2 text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Profile
                  </NavLink>
                  <button 
                    onClick={handleLogout}
                    className="text-left pl-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className="inline-block btn-outline text-center mt-2" onClick={toggleMenu}>
                  Log In
                </NavLink>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
