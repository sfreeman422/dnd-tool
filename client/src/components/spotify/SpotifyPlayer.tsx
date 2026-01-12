import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getStatus, getPlayback, play, pause, getAuthUrl } from '../../services/spotifyApi';

export default function SpotifyPlayer() {
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: status } = useQuery({
    queryKey: ['spotify-status'],
    queryFn: getStatus,
    refetchInterval: 30000
  });

  const { data: playback, refetch: refetchPlayback } = useQuery({
    queryKey: ['spotify-playback'],
    queryFn: getPlayback,
    enabled: status?.connected,
    refetchInterval: 5000
  });

  const playMutation = useMutation({
    mutationFn: play,
    onSuccess: () => refetchPlayback()
  });

  const pauseMutation = useMutation({
    mutationFn: pause,
    onSuccess: () => refetchPlayback()
  });

  // Check URL params for Spotify connection status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('spotify_connected')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const url = await getAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      setIsConnecting(false);
    }
  };

  if (!status?.connected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded flex items-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        {isConnecting ? 'Connecting...' : 'Connect Spotify'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gray-700 rounded-lg px-3 py-2">
      {playback?.track ? (
        <>
          {playback.track.albumArt && (
            <img
              src={playback.track.albumArt}
              alt="Album art"
              className="w-10 h-10 rounded"
            />
          )}
          <div className="max-w-[200px]">
            <div className="text-sm font-medium truncate">{playback.track.name}</div>
            <div className="text-xs text-gray-400 truncate">{playback.track.artists}</div>
          </div>
          <button
            onClick={() => playback.isPlaying ? pauseMutation.mutate() : playMutation.mutate()}
            className="p-2 hover:bg-gray-600 rounded-full"
          >
            {playback.isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </>
      ) : (
        <div className="text-sm text-gray-400">No track playing</div>
      )}
    </div>
  );
}
