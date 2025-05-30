import { GraphQLClient } from 'graphql-request';
import { useEffect, useRef, useState } from 'react';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import skipIcon from '../assets/icons/skip.svg';
import 'spotify-audio-element';
import Spinner from './Spinner';

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

  const getImageStackingIndex = (index: number, current: number) => {
    // index = the element's place in the sequence
    // current = the current selection from this sequence

    // if the index of this element places it one after the currently selected element
    // i.e. is it next in the queue
    // if so, put it at the top of the stack using zIndex
    if (index === current + 1) {
      return 1;
    }

    // if this element is the first track in the sequence and we are playing the last track in the sequence
    if (index === 0 && current === numberOfTracks - 1) {
      return 1;
    }

    return 0;
  };

  const getClickAction = (index: number, current: number, spotifyUrl: string) => {
    if (index === current) {
      window.open(spotifyUrl, '_blank');
      return;
    }

    if (index === current + 1) {
      skipTrack();
      return;
    }

    if (index === 0 && current === numberOfTracks - 1) {
      setCurrentTrack(0);
    }
  };

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
    status === 'loading' && <Spinner color="pink" />;
  }

  {
    status === 'error' && <p>Error loading tracks.</p>;
  }

  return (
    <div className="p-4 bg-primary-cream max-w-[350px] z-2 relative pb-12 w-full">
      <p className="text-primary-pink">
        If you listen to this on{' '}
        <a
          className="underline"
          href={(tracks && tracks[currentTrack]?.spotifyUrl) || ''}
          target="_blank"
          rel="noopener noreferrer"
        >
          Spotify
        </a>{' '}
        I get paid, but this is free
      </p>

      {status === 'loading' && <Spinner color="pink" />}
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
                      onClick={() => getClickAction(index, currentTrack, track.spotifyUrl)}
                      style={{
                        zIndex: getImageStackingIndex(index, currentTrack),
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
            <div className="mt-3 flex gap-16 bg-primary-yellow min-w-24 min-h-20 py-1 px-3">
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
