import { GraphQLClient } from 'graphql-request';
import { useEffect, useRef, useState } from 'react';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import skipIcon from '../assets/icons/skip.svg';
import 'spotify-audio-element';

export type TracksQueryResponse = {
  tracks: Track[];
};

type Track = {
  audioFile: {
    url: string;
  };
  title: string;
  spotifyUrl: string;
  id: string;
  coverArt: {
    url: string;
  };
};

function AudioPlayer() {
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [status, setStatus] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Audio ref
  const numberOfTracks = tracks?.length || 0;

  const hygraph = new GraphQLClient(
    'https://eu-west-2.cdn.hygraph.com/content/cm7rxywmw017d07uoxco3a326/master'
  );

  const query = `
    query {
      tracks(first: 20) {
        audioFile {
          url
        }
        title
        spotifyUrl
        id
        coverArt {
          url
        }
      }
    }
  `;

  const fetchTracks = async () => {
    setStatus('loading');

    try {
      const { tracks } = await hygraph.request<TracksQueryResponse>(query);
      console.log({ tracks });

      setTracks(tracks);
      setStatus('complete');
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  // Controls
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipTrack = () => {
    if (currentTrack + 1 < numberOfTracks) {
      setCurrentTrack(currentTrack + 1);
      return;
    }

    setCurrentTrack(0);
  };

  {
    status === 'loading' && <p>Loading tracks...</p>;
  }
  {
    status === 'error' && <p>Error loading tracks.</p>;
  }

  return (
    <div className="p-4 bg-primary-cream max-w-[350px] z-2 relative pb-12 w-full">
      <p className="text-primary-pink">
        If you listen to this on{' '}
        <a className="underline" href={(tracks && tracks[currentTrack]?.spotifyUrl) || ''}>
          Spotify
        </a>{' '}
        I get paid, but this is free
      </p>

      {status === 'loading' && <p>Loading tracks...</p>}
      {status === 'error' && <p>Error loading tracks.</p>}

      {tracks && tracks.length > 0 ? (
        <div className="mt-4">
          <audio
            ref={audioRef}
            src={tracks[currentTrack].audioFile.url}
            autoPlay={isPlaying}
            controls
            className="opacity-0 pointer-events-none max-h-0 max-w-0"
          />

          <div className="flex">
            {/* ARTWORK CAROUSEL */}
            <div className="flex relative basis-3/4 pt-1">
              {tracks.map((track: Track, index) => (
                <>
                  <div
                    className="flex absolute transition-all duration-200"
                    style={{
                      right: currentTrack === index ? '50%' : 0,
                    }}
                  >
                    <img
                      src={track.coverArt.url}
                      className="border-3 border-primary-yellow w-24 h-24 object-cover transition-all duration-200"
                      style={{
                        transform: currentTrack === index ? 'scale(1)' : 'scale(0.5)',
                      }}
                    />
                    <img
                      src={playIcon}
                      className="w-3 ml-1"
                      style={{ opacity: currentTrack === index ? 1 : 0 }}
                    />
                  </div>
                  <p
                    className="text-xs text-primary-pink -bottom-8 left-0 absolute transition-all duration-200"
                    style={{ opacity: currentTrack === index ? 1 : 0 }}
                  >
                    {track?.title || ''}
                  </p>
                </>
              ))}
            </div>
            {/* PLAYBACK CONTROLS */}
            <div className="mt-3 flex gap-16 bg-primary-yellow min-w-24 min-h-20 p-1">
              <div className="relative">
                <button
                  onClick={playAudio}
                  className="bg-primary-pink p-2 rounded-full absolute w-14 top-2"
                  style={{
                    opacity: isPlaying ? 0 : 1,
                    pointerEvents: isPlaying ? 'none' : 'initial',
                  }}
                >
                  <img src={playIcon} className="w-15" />
                </button>
                <button
                  onClick={pauseAudio}
                  className="bg-primary-pink p-2 rounded-full absolute w-14 top-2"
                  style={{
                    opacity: isPlaying ? 1 : 0,
                    pointerEvents: isPlaying ? 'initial' : 'none',
                  }}
                >
                  <img src={pauseIcon} className="w-15" />
                </button>
              </div>
              <button onClick={skipTrack}>
                <img src={skipIcon} className="bg-primary-pink p-2 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-primary-pink">No tracks available.</p>
      )}
    </div>
  );
}

export default AudioPlayer;
