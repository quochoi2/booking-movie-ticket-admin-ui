import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import AuthService from "@/services/authService";
import { IconButton } from "@material-tailwind/react";
import { useContext } from "react";
import { UserContext } from "@/context/authContext";

const LogoutButton = () => {
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <IconButton
      variant="text"
      color="blue-gray"
      onClick={handleLogout}
    >
      <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
    </IconButton>
  );
};

export default LogoutButton;
