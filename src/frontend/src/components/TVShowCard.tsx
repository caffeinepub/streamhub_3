import { Link } from '@tanstack/react-router';
import { Tv } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TVShowCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  episodeCount: number;
}

export default function TVShowCard({ id, title, thumbnailUrl, episodeCount }: TVShowCardProps) {
  return (
    <Link to="/shows/$id" params={{ id }} className="group">
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={thumbnailUrl || '/assets/generated/tv-show-poster-placeholder.dim_300x450.png'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/tv-show-poster-placeholder.dim_300x450.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-amber-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Tv className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {episodeCount} {episodeCount === 1 ? 'Episode' : 'Episodes'}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
