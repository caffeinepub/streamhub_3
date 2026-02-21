import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import TVShowCard from '../components/TVShowCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tv } from 'lucide-react';

export default function TVShowsPage() {
  const { actor, isFetching: isActorFetching } = useActor();

  const { data: shows, isLoading, error } = useQuery({
    queryKey: ['tvshows'],
    queryFn: async () => {
      if (!actor) return [];
      // Since backend doesn't have a getAllTVShows method, we'll return empty array
      return [];
    },
    enabled: !!actor && !isActorFetching,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Tv className="w-8 h-8 text-amber-500" />
          TV Shows
        </h2>
        <p className="text-muted-foreground">Explore our TV show collection</p>
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
            Failed to load TV shows. Please try again later.
          </AlertDescription>
        </Alert>
      ) : shows && shows.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {shows.map((show: any) => (
            <TVShowCard
              key={show.id}
              id={show.id}
              title={show.title}
              thumbnailUrl={show.thumbnailUrl}
              episodeCount={show.episodeCount}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Tv className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No TV shows available</h3>
          <p className="text-muted-foreground">
            Check back later for new content
          </p>
        </div>
      )}
    </div>
  );
}
