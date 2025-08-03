import {
  HomeIcon,
  TableCellsIcon,
  InformationCircleIcon,
  FilmIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/solid'
import { Home } from './pages/dashboard/home'
import { CinemaPage } from './pages/dashboard/cinema'
import { MoviePage } from './pages/dashboard/movie'
import { ShowTime } from './pages/dashboard/showTime'
import { AuthorizePage } from './pages/dashboard/authorize'
import { CheckPayemnt } from './pages/dashboard/check-payment'

const icon = {
  className: 'w-5 h-5 text-inherit'
}

export const routes = [
  {
    layout: 'dashboard',
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: 'Trang Chủ',
        path: '/home',
        element: <CheckPayemnt />,
        roles: ['admin', 'employee']
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: 'Nhân Viên',
        path: '/authorize',
        element: <AuthorizePage />,
        roles: ['admin']
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: 'Rạp Phim',
        path: '/cinema',
        element: <CinemaPage />,
        roles: ['admin']
      },
      {
        icon: <FilmIcon {...icon} />,
        name: 'Phim',
        path: '/movie',
        element: <MoviePage />,
        roles: ['admin']
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: 'Giờ Chiếu',
        path: '/show-time',
        element: <ShowTime />,
        roles: ['admin']
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: 'Thống kê',
        path: '/check-payment',
        element: <Home />,
        roles: ['admin', 'employee']
      }
    ]
  }
]

export default routes
