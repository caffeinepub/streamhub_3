import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import VideoPlayer from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, Clock, Film } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';

export default function MovieDetailPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useActor();

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        const principal = Principal.fromText(id);
        return await actor.getMovie(principal);
      } catch (err) {
        console.error('Error fetching movie:', err);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching && !!id,
  });

  const formatDuration = (minutes: bigint) => {
    const mins = Number(minutes);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hours > 0 ? `${hours}h ${remainingMins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="aspect-video w-full mb-8 rounded-xl" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/movies' })} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movies
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Movie not found or failed to load. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/movies' })}
        className="mb-8 hover:bg-accent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Movies
      </Button>

      <div className="max-w-6xl mx-auto">
        <VideoPlayer videoUrl={movie.videoUrl} title={movie.title} />

        <div className="mt-8 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <Badge variant="secondary" className="text-sm">
                <Film className="w-4 h-4 mr-1" />
                {movie.genre}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{Number(movie.releaseYear)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
