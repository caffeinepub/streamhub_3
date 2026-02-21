import { Link } from '@tanstack/react-router';
import { Clock, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EpisodeCardProps {
  id: string;
  showId: string;
  title: string;
  thumbnailUrl: string;
  duration: bigint;
  episodeNumber: bigint;
  seasonNumber: bigint;
}

export default function EpisodeCard({
  id,
  showId,
  title,
  thumbnailUrl,
  duration,
  episodeNumber,
  seasonNumber,
}: EpisodeCardProps) {
  const formatDuration = (minutes: bigint) => {
    const mins = Number(minutes);
    return `${mins}m`;
  };

  return (
    <Link to="/shows/$showId/episodes/$episodeId" params={{ showId, episodeId: id }} className="group">
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
        <div className="flex gap-4 p-4">
          <div className="relative w-40 aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={thumbnailUrl || '/assets/generated/tv-show-poster-placeholder.dim_300x450.png'}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/assets/generated/tv-show-poster-placeholder.dim_300x450.png';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
          <CardContent className="flex-1 p-0 flex flex-col justify-center">
            <div className="text-sm text-muted-foreground mb-1">
              Episode {Number(episodeNumber)}
            </div>
            <h4 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors">
              {title}
            </h4>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(duration)}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
