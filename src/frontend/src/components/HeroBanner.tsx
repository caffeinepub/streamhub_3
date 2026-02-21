export default function HeroBanner() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl mb-12">
      <img
        src="/assets/generated/hero-banner.dim_1920x600.png"
        alt="StreamHub Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-2xl">
          Welcome to StreamHub
        </h1>
        <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl drop-shadow-lg">
          Discover unlimited movies and TV shows
        </p>
      </div>
    </div>
  );
}
