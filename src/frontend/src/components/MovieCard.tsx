import { Link } from '@tanstack/react-router';
import { Clock, Film } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: bigint;
  genre: string;
}

export default function MovieCard({ id, title, thumbnailUrl, duration, genre }: MovieCardProps) {
  const formatDuration = (minutes: bigint) => {
    const mins = Number(minutes);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hours > 0 ? `${hours}h ${remainingMins}m` : `${mins}m`;
  };

  return (
    <Link to="/movies/$id" params={{ id }} className="group">
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={thumbnailUrl || '/assets/generated/movie-poster-placeholder.dim_300x450.png'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/movie-poster-placeholder.dim_300x450.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-amber-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-xs">
              {genre}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
