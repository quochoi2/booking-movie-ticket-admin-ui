import {
  HomeIcon,
  TableCellsIcon,
  InformationCircleIcon,
  FilmIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import { Home } from "./pages/dashboard/home";
import { CinemaPage } from "./pages/dashboard/cinema";
import { Notifications } from "./pages/dashboard/notification";
import { MoviePage } from "./pages/dashboard/movie";
import { ShowTime } from "./pages/dashboard/showTime";
import { AuthorizePage } from "./pages/dashboard/authorize";

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
        roles: ["admin", "employee"],
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Authorize",
        path: "/authorize",
        element: <AuthorizePage />,
        roles: ["admin"],
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Cinema",
        path: "/cinema",
        element: <CinemaPage />,
        roles: ["admin", "employee"],
      },
      {
        icon: <FilmIcon {...icon} />,
        name: "Movie",
        path: "/movie",
        element: <MoviePage />,
        roles: ["admin", "employee"],
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Show",
        path: "/show-time",
        element: <ShowTime />,
        roles: ["admin", "employee"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        roles: ["admin"],
      },
    ],
  },
];

export default routes;
