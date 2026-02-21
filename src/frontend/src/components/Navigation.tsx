import { Link, useRouterState } from '@tanstack/react-router';
import { Film, Tv } from 'lucide-react';

export default function Navigation() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isMoviesActive = currentPath.startsWith('/movies');
  const isShowsActive = currentPath.startsWith('/shows');

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/movies" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              StreamHub
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/movies"
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                isMoviesActive
                  ? 'bg-amber-500/10 text-amber-500 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Film className="w-5 h-5" />
              <span>Movies</span>
            </Link>
            <Link
              to="/shows"
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                isShowsActive
                  ? 'bg-amber-500/10 text-amber-500 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Tv className="w-5 h-5" />
              <span>TV Shows</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
