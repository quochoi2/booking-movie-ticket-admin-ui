import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  FilmIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import { Home } from "./pages/dashboard/home";
import { Profile } from "./pages/dashboard/profile";
import { CinemaPage } from "./pages/dashboard/cinema";
import { Notifications } from "./pages/dashboard/notification";
import { MoviePage } from "./pages/dashboard/movie";
import { Tables } from "./pages/dashboard";
import { ShowTime } from "./pages/dashboard/showTime";

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
        icon: <CalendarDaysIcon {...icon} />,
        name: "Show",
        path: "/show-time",
        element: <ShowTime />,
        roles: ["admin"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        roles: ["user"],
      },
    ],
  },
];

export default routes;
