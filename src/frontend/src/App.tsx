import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, redirect } from '@tanstack/react-router';
import Layout from './components/Layout';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TVShowDetailPage from './pages/TVShowDetailPage';
import EpisodePlayerPage from './pages/EpisodePlayerPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/movies' });
  },
});

const moviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movies',
  component: MoviesPage,
});

const movieDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movies/$id',
  component: MovieDetailPage,
});

const showsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shows',
  component: TVShowsPage,
});

const showDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shows/$id',
  component: TVShowDetailPage,
});

const episodePlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shows/$showId/episodes/$episodeId',
  component: EpisodePlayerPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  moviesRoute,
  movieDetailRoute,
  showsRoute,
  showDetailRoute,
  episodePlayerRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
