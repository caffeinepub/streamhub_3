import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import VideoPlayer from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';

export default function EpisodePlayerPage() {
  const { showId, episodeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useActor();

  const { data: episode, isLoading: isLoadingEpisode } = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: async () => {
      if (!actor || !episodeId) return null;
      try {
        const principal = Principal.fromText(episodeId);
        return await actor.getEpisode(principal);
      } catch (err) {
        console.error('Error fetching episode:', err);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching && !!episodeId,
  });

  const { data: allEpisodes, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ['episodes', showId],
    queryFn: async () => {
      if (!actor || !showId) return [];
      try {
        const principal = Principal.fromText(showId);
        return await actor.getEpisodesByTVShow(principal);
      } catch (err) {
        console.error('Error fetching episodes:', err);
        return [];
      }
    },
    enabled: !!actor && !isActorFetching && !!showId,
  });

  const isLoading = isLoadingEpisode || isLoadingEpisodes;

  // Find current episode index and determine next/previous
  const currentIndex = allEpisodes?.findIndex((ep: any) => 
    ep === episode
  ) ?? -1;

  const previousEpisode = currentIndex > 0 ? allEpisodes?.[currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < (allEpisodes?.length ?? 0) - 1 
    ? allEpisodes?.[currentIndex + 1] 
    : null;

  const formatDuration = (minutes: bigint) => {
    const mins = Number(minutes);
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="aspect-video w-full mb-8 rounded-xl" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/shows/$id', params: { id: showId! } })} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Show
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Episode not found or failed to load. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/shows/$id', params: { id: showId! } })}
        className="mb-8 hover:bg-accent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Show
      </Button>

      <div className="max-w-6xl mx-auto">
        <VideoPlayer videoUrl={episode.videoUrl} title={episode.title} />

        <div className="mt-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                Season {Number(episode.seasonNumber)} • Episode {Number(episode.episodeNumber)}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(episode.duration)}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {episode.title}
            </h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">{episode.description}</p>
          </div>

          <div className="flex gap-4 pt-4">
            {previousEpisode && (
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/shows/$showId/episodes/$episodeId', params: { showId: showId!, episodeId: episodeId! } })}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Episode
              </Button>
            )}
            {nextEpisode && (
              <Button
                variant="default"
                onClick={() => navigate({ to: '/shows/$showId/episodes/$episodeId', params: { showId: showId!, episodeId: episodeId! } })}
                className="flex-1 bg-amber-500 hover:bg-amber-600"
              >
                Next Episode
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
