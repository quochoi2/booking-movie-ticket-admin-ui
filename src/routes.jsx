import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  FilmIcon,
} from "@heroicons/react/24/solid";
import { Home } from "./pages/dashboard/home";
import { Profile } from "./pages/dashboard/profile";
import { CinemaPage } from "./pages/dashboard/cinema";
import { Notifications } from "./pages/dashboard/notification";
import { MoviePage } from "./pages/dashboard/movie";
import { Tables } from "./pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
        roles: ["admin"],
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
        roles: ["admin"],
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Cinema",
        path: "/cinema",
        element: <CinemaPage />,
        roles: ["admin"],
      },
      {
        icon: <FilmIcon {...icon} />,
        name: "Movie",
        path: "/movie",
        element: <MoviePage />,
        roles: ["admin"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        roles: ["admin"],
      },
      {
        icon: <FilmIcon {...icon} />,
        name: "Tables",
        path: "/tables",
        element: <Tables />,
        roles: ["admin"],
      },
    ],
  },
];

export default routes;