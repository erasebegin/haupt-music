import './index.css';
import Logo from './components/Logo';
import { useEffect, useState } from 'react';
import MailingList from './components/MailingList';
import Feedback from './components/Feedback';
import AudioPlayer from './components/SpotifyPlayer';

export function App() {
  const logoBaseSize = 55;
  const [logoColor, setLogoColor] = useState('rgb(0, 209, 255)');
  const [logoSize, setLogoSize] = useState(logoBaseSize);
  const [backgroundColor, setBackground] = useState('rgb(255, 205, 0)');

  useEffect(() => {
    // Set initial size based on device width
    if (window.innerWidth < 768) {
      setLogoSize(100);
    }
    const getMaxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = getMaxScroll();
      const scrollPercentage = Math.min((scrollPosition / maxScroll) * 100, 100);

      const easedScroll = Math.pow(scrollPercentage, 1.75) / 100;

      // Logo color transition (from 0, 209, 255)
      const logoR = Math.round(0 + 255 * (scrollPercentage / 100));
      const logoG = Math.round(209 - 109 * (scrollPercentage / 100)); // Transition towards 100
      const logoB = Math.round(255 - 155 * (scrollPercentage / 100)); // Transition towards 100

      // Background color transition (from 255, 205, 0)
      const bgR = Math.round(255 - 155 * (scrollPercentage / 100)); // Transition towards 100
      const bgG = Math.round(205 + 50 * (scrollPercentage / 100)); // Transition towards 255
      const bgB = Math.round(0 + 255 * (scrollPercentage / 100)); // Transition towards 255

      // Use a larger base size and smaller expansion rate on mobile devices
      const isMobile = window.innerWidth < 768;
      const expansionRate = isMobile ? 2 : 5;
      const mobileBaseSize = isMobile ? 100 : logoBaseSize;

      setLogoSize(mobileBaseSize + easedScroll * expansionRate);
      setLogoColor(`rgb(${logoR}, ${logoG}, ${logoB})`);
      setBackground(`rgb(${bgR}, ${bgG}, ${bgB})`);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-hidden px-5 py-10 flex flex-col items-center"
      style={{ backgroundColor }}
    >
      <Logo
        className="fixed w-full md:min-w-[750px] z-1 md:top-7 md:-left-3 top-2 left-1/2 -translate-x-1/2 md:translate-x-0"
        color={logoColor}
        size={logoSize}
      />

      {/* MAILING LIST */}
      <MailingList />

      {/* SPOTIFY PLAYER */}
      <AudioPlayer />

      {/* SOCIAL LINKS */}
      <div className="bg-primary-cream flex gap-6 justify-center py-8 mt-5 z-2 relative px-5 min-w-[350px]">
        <a
          href="https://www.tiktok.com/@hauptaupt"
          className="relative text-primary-pink text-xl underline-effect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tik Tok
        </a>
        <a
          href="https://www.instagram.com/hauptaupt/"
          className="relative text-primary-pink text-xl underline-effect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://open.spotify.com/artist/4rrzTA2rvLjZqJoUIXR9uK?si=QzLUBltUTwiAqLSSPVUAvQ"
          className="relative text-primary-pink text-xl underline-effect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Spotify
        </a>
      </div>

      {/* FEEDBACK FORM */}
      <Feedback />
    </div>
  );
}

export default App;
