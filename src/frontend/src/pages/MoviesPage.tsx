import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Film } from 'lucide-react';

export default function MoviesPage() {
  const { actor, isFetching: isActorFetching } = useActor();

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      if (!actor) return [];
      // Since backend doesn't have a getAllMovies method, we'll return empty array
      // In a real app, you'd need to add sample data or implement the backend method
      return [];
    },
    enabled: !!actor && !isActorFetching,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Film className="w-8 h-8 text-amber-500" />
          All Movies
        </h2>
        <p className="text-muted-foreground">Browse our collection of movies</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load movies. Please try again later.
          </AlertDescription>
        </Alert>
      ) : movies && movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie: any) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              thumbnailUrl={movie.thumbnailUrl}
              duration={movie.duration}
              genre={movie.genre}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No movies available</h3>
          <p className="text-muted-foreground">
            Check back later for new content
          </p>
        </div>
      )}
    </div>
  );
}
