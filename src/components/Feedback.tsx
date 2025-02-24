import { FC, useState } from 'react';
import Spinner from './Spinner';

const Feedback: FC = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  function getMessage(s: string): string {
    let message = '';
    switch (s) {
      case 'loading':
        message = '';
        break;
      case 'success':
        message = '';
        break;
      case 'empty':
        message = 'Not enough suggestion';
        break;
      case 'error':
        message = "That didn't work, something's conked out";
        break;
    }
    return message;
  }

  const sendFeedback = async () => {
    if (!message.trim()) {
      setStatus('empty');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      setStatus('error');
    }
  };

  return (
    <div className="py-30 z-2 relative w-full max-w-[350px]">
      <textarea
        className="h-[200px] w-[300px] bg-primary-cream p-3"
        style={{
          opacity: status === 'success' ? 0.5 : 1,
        }}
        placeholder="suggestion box"
        value={message}
        onChange={e => setMessage(e.target.value)}
        disabled={status === 'success'}
      />
      <button
        className="bg-primary-pink text-primary-cream w-[110px] absolute right-0 top-40"
        style={{
          height: status === 'success' ? 100 : 70,
        }}
        onClick={sendFeedback}
      >
        <span className="absolute text-lg top-3" style={{ right: status === 'success' ? 0 : 30 }}>
          {status === 'success' ? "YOU'RE ASKING A LOT" : status === 'loading' ? <Spinner /> : 'OK'}
        </span>
      </button>
      {getMessage(status) && (
        <p className="bg-primary-cream text-primary-pink p-3 w-[300px]">{getMessage(status)}</p>
      )}
    </div>
  );
};

export default Feedback;
