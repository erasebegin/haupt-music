import './index.css';
import Logo from './components/Logo';
import { useEffect, useState } from 'react';
import MailingList from './components/MailingList';

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
      className="min-h-[100dvh] w-full relative overflow-hidden px-5 py-10 flex flex-col align-center"
      style={{ backgroundColor }}
    >
      <Logo className="fixed min-w-[750px] z-1 top-7 -left-15" color={logoColor} />

      {/* CONTACT */}
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
      <div className="bg-primary-cream flex gap-3 justify-center py-8 mt-5 z-2 relative">
        <a href="https://www.instagram.com" className="text-primary-pink text-xl">
          Tik Tok
        </a>
        <a href="https://www.instagram.com" className="text-primary-pink text-xl">
          Instagram
        </a>
        <a href="https://www.instagram.com" className="text-primary-pink text-xl">
          Spotify
        </a>
      </div>
      {/* FEEDBACK FORM */}
      <div className="py-20 z-2 relative">
        <textarea className="h-[200px] bg-primary-cream p-3" placeholder="suggestion box" />
        <button className="bg-primary-pink text-primary-cream w-[110px] h-[70px] absolute right-14 top-40">
          <span className="absolute text-lg top-3">OK</span>
        </button>
      </div>
    </div>
  );
}

export default App;
