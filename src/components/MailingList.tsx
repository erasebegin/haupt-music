import { FC, useState } from 'react';
import Spinner from './Spinner';
import { isValidEmail } from '@/utils';

const MailingList: FC = () => {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');

  async function submitEmail() {
    if (!isValidEmail(email)) {
      setStatus('invalid-email');
      return;
    }

    if (email.length <= 0) {
      setStatus('empty');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbwwl3F6YgnA1vnfp9cFCJGA94F-WDmdtHYsSdWT_IaDvxOhqPujJJEncqQ7bmcvWC41SQ/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log({ response });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.error('Error:', error);
    }
  }

  function getMessage(s: string): string {
    let message = 'Friends forever';
    switch (s) {
      case 'loading':
        message = 'Hang on a sec...';
        break;
      case 'success':
        message = 'Good stuff';
        break;
      case 'empty':
        message = "There's nothing here...";
        break;
      case 'error':
        message = "That didn't work, something's conked out";
        break;
      case 'invalid-email':
        message = "Are you sure that's an email address?";
        break;
    }
    return message;
  }

  return (
    <div className="relative z-2 h-[250px] w-full">
      <div
        className="pt-5 pb-20 absolute transition-all duration-200 ease-in-out left-1/2 w-[300px]"
        style={{
          transform: step === 0 ? 'translateX(-50%)' : 'translateX(110%)',
          opacity: step === 0 ? 1 : 0,
          pointerEvents: step === 0 ? 'initial' : 'none',
        }}
      >
        <p className="bg-primary-cream p-5 mb-5 text-primary-pink">
          You don't have to give me your email but you should
        </p>
        <button
          className="bg-primary-pink text-primary-cream w-[110px] h-[70px] relative"
          onClick={() => setStep(2)}
        >
          <span className="absolute text-lg top-3">OK</span>
        </button>
        <button
          className="bg-primary-pink text-primary-cream text-left w-[110px] h-[70px] relative ml-3"
          onClick={() => setStep(1)}
        >
          <span className="absolute bottom-0 right-6 text-lg">
            WH
            <br />Y
          </span>
        </button>
      </div>

      <div
        className="pt-5 pb-20 absolute top-0 left-1/2 transition-all duration-200 ease-in-out"
        style={{
          transform: step === 2 ? 'translateX(-50%)' : 'translateX(-110%)',
          opacity: step === 2 ? 1 : 0,
          pointerEvents: step === 2 ? 'initial' : 'none',
        }}
      >
        <p className="bg-primary-cream p-5 mb-5 text-primary-pink">{getMessage(status)}</p>
        <div className="flex items-center">
          <input
            className={`bg-primary-cream h-[42px] p-3`}
            style={{
              opacity: status === 'success' ? 0.5 : 1,
            }}
            placeholder="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setStatus('');
            }}
            disabled={status === 'success'}
          />
          <button
            className="bg-primary-pink text-primary-cream w-[110px] h-[70px] relative"
            onClick={submitEmail}
            disabled={status === 'success'}
          >
            <span
              className={`absolute text-lg top-3 ${status === 'success' ? 'left-2' : 'left-10'}`}
            >
              {status === 'loading' ? <Spinner /> : status === 'success' ? 'THANKS' : 'OK'}
            </span>
          </button>
        </div>
      </div>

      <div
        className="pt-5 pb-20 absolute transition-all duration-200 ease-in-out left-1/2 w-[300px]"
        style={{
          transform: step === 1 ? 'translateX(-50%)' : 'translateX(-110%)',
          opacity: step === 1 ? 1 : 0,
          pointerEvents: step === 1 ? 'initial' : 'none',
        }}
      >
        <p className="bg-primary-cream p-5 mb-5 text-primary-pink">It's a secret</p>
        <button
          className="bg-primary-pink text-primary-cream w-[110px] h-[70px] relative"
          onClick={() => setStep(2)}
        >
          <span className="absolute text-lg top-3">OK</span>
        </button>
        <button
          className="bg-primary-pink text-primary-cream text-left w-[110px] h-[70px] relative ml-3"
          onClick={() => setStep(2)}
        >
          <span className="absolute bottom-0 right-6 text-lg">OK</span>
        </button>
      </div>
    </div>
  );
};

export default MailingList;
