import './index.css';
import Logo from './components/Logo';
import { useEffect, useState } from 'react';
import MailingList from './components/MailingList';
import Feedback from './components/Feedback';

export function App() {
  const [logoColor, setLogoColor] = useState('rgb(0, 209, 255)');
  const [backgroundColor, setBackground] = useState('rgb(255, 205, 0)');

  useEffect(() => {
    const getMaxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = getMaxScroll();
      const scrollPercentage = Math.min((scrollPosition / maxScroll) * 100, 100);

      // Logo color transition (from 0, 209, 255)
      const logoR = Math.round(0 + 255 * (scrollPercentage / 100));
      const logoG = Math.round(209 - 109 * (scrollPercentage / 100)); // Transition towards 100
      const logoB = Math.round(255 - 155 * (scrollPercentage / 100)); // Transition towards 100

      // Background color transition (from 255, 205, 0)
      const bgR = Math.round(255 - 155 * (scrollPercentage / 100)); // Transition towards 100
      const bgG = Math.round(205 + 50 * (scrollPercentage / 100)); // Transition towards 255
      const bgB = Math.round(0 + 255 * (scrollPercentage / 100)); // Transition towards 255

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
      <Logo className="fixed min-w-[750px] z-1 top-7 -left-15" color={logoColor} />

      {/* MAILING LIST */}
      <MailingList />

      {/* SPOTIFY PLAYER */}
      <div className="z-2 relative pb-20">
        <iframe
          src="https://open.spotify.com/embed/track/3QYlmgJB2yFgsIwdXmeiiz?utm_source=generator&theme=0"
          width="100%"
          height="352"
          allowFullScreen={false}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      {/* SOCIAL LINKS */}
      <div className="bg-primary-cream flex gap-6 justify-center py-8 mt-5 z-2 relative px-5">
        <a
          href="https://www.tiktok.com"
          className="relative text-primary-pink text-xl underline-effect"
        >
          Tik Tok
        </a>
        <a
          href="https://www.instagram.com"
          className="relative text-primary-pink text-xl underline-effect"
        >
          Instagram
        </a>
        <a
          href="https://www.spotify.com"
          className="relative text-primary-pink text-xl underline-effect"
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
