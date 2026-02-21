import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import EpisodeCard from '../components/EpisodeCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Tv } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';

export default function TVShowDetailPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useActor();

  const { data: show, isLoading: isLoadingShow } = useQuery({
    queryKey: ['tvshow', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        const principal = Principal.fromText(id);
        return await actor.getTVShow(principal);
      } catch (err) {
        console.error('Error fetching TV show:', err);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching && !!id,
  });

  const { data: episodes, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ['episodes', id],
    queryFn: async () => {
      if (!actor || !id) return [];
      try {
        const principal = Principal.fromText(id);
        return await actor.getEpisodesByTVShow(principal);
      } catch (err) {
        console.error('Error fetching episodes:', err);
        return [];
      }
    },
    enabled: !!actor && !isActorFetching && !!id,
  });

  const isLoading = isLoadingShow || isLoadingEpisodes;

  // Group episodes by season
  const episodesBySeason = episodes?.reduce((acc: Record<number, any[]>, episode: any) => {
    const season = Number(episode.seasonNumber);
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {}) || {};

  // Sort episodes within each season
  Object.keys(episodesBySeason).forEach((season) => {
    episodesBySeason[Number(season)].sort(
      (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber)
    );
  });

  const seasons = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3 mb-8" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/shows' })} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to TV Shows
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            TV show not found or failed to load. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/shows' })}
        className="mb-8 hover:bg-accent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to TV Shows
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-64 flex-shrink-0">
            <img
              src={show.thumbnailUrl || '/assets/generated/tv-show-poster-placeholder.dim_300x450.png'}
              alt={show.title}
              className="w-full rounded-xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.src = '/assets/generated/tv-show-poster-placeholder.dim_300x450.png';
              }}
            />
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {show.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tv className="w-5 h-5" />
              <span>{Number(show.seasons)} {Number(show.seasons) === 1 ? 'Season' : 'Seasons'}</span>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">{show.description}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Episodes</h2>
          {seasons.length > 0 ? (
            <Tabs defaultValue={`season-${seasons[0]}`} className="w-full">
              <TabsList className="mb-6">
                {seasons.map((season) => (
                  <TabsTrigger key={season} value={`season-${season}`}>
                    Season {season}
                  </TabsTrigger>
                ))}
              </TabsList>
              {seasons.map((season) => (
                <TabsContent key={season} value={`season-${season}`} className="space-y-4">
                  {episodesBySeason[season].map((episode: any, index: number) => (
                    <EpisodeCard
                      key={index}
                      id={id!}
                      showId={id!}
                      title={episode.title}
                      thumbnailUrl={episode.thumbnailUrl}
                      duration={episode.duration}
                      episodeNumber={episode.episodeNumber}
                      seasonNumber={episode.seasonNumber}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No episodes available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
