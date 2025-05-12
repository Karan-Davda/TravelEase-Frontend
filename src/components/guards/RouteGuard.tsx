
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchApi } from '@/utils/apiHelper';
import { isAuthenticated, getAuthToken } from '@/utils/authUtils';
import { useToast } from '@/hooks/use-toast';

interface MenuCheckResponse {
  MenuID: number;
  MenuName: string;
  DisplayName: string;
  IsLogginRequired: boolean;
}

interface RoleWiseMenuItem {
  RoleWiseMenuID: number;
  RoleID: number;
  MenuID: number;
  IsLandingPage: boolean;
  Status: string;
  Created: string;
  Modified: string;
  ModifiedBy: number;
  Menu: {
    MenuName: string;
    DisplayName: string;
    IsInternalScreen: boolean;
    URL: string;
  };
}

interface RouteGuardProps {
  children: ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);
      try {
        // Step 1: Check if login is required for this route
        const url = location.pathname;
        const menuCheckResponse = await fetchApi<MenuCheckResponse>(
          `http://localhost:3000/api/admin/access/menu/loginCheck?url=${url}`
        );

        // If login is not required, allow access with default RoleID = 1
        if (!menuCheckResponse.IsLogginRequired) {
          // Check if non-logged in user (RoleID = 1) has access to this route
          // const roleMenuItems = await fetchApi<RoleWiseMenuItem[]>(
          //   `http://localhost:3000/api/admin/access/roleWiseMenu/Menus/1`
          // );
          
          // Check if current URL exists in allowed URLs for default role
          const hasAccess = true;
          
          if (!hasAccess) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this page.",
              variant: "destructive",
            });
            navigate('/unauthorized');
            return;
          }
          
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }
        
        // If we're here, login is required for this route
        if (!isAuthenticated()) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access this page.",
            variant: "destructive",
          });
          navigate('/login', { state: { from: location } });
          return;
        }

        // Get user profile to fetch role ID
        const token = getAuthToken();
        const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userProfile = await profileResponse.json();
        
        if (!userProfile.role) {
          toast({
            title: "Access Denied",
            description: "Your user profile doesn't have a role assigned.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Check if user's role has access to this route
        const roleMenuItems = await fetchApi<RoleWiseMenuItem[]>(
          `http://localhost:3000/api/admin/access/roleWiseMenu/Menus/${userProfile.role}`
        );

        // Check if current URL exists in allowed URLs for user's role
        const hasAccess = roleMenuItems.some(item => item.Menu.URL === url);
        
        if (!hasAccess) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate('/unauthorized');
          return;
        }

        // If we reached here, user is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking route access:', error);
        toast({
          title: "Error",
          description: "Failed to verify access permissions. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [location, navigate, toast]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default RouteGuard;
