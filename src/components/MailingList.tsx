import { FC, useState } from 'react';

const MailingList: FC = () => {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');

  async function submitEmail() {
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

  return (
    <div className="relative z-2 h-[250px] w-full">
      <div
        className="pt-5 pb-20 absolute transition-all duration-200 ease-in-out"
        style={{ transform: step === 0 ? 'translateX(0)' : 'translateX(110%)' }}
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
        className="pt-5 pb-20 absolute top-0 left-0 transition-all duration-200 ease-in-out w-full"
        style={{ transform: step === 2 ? 'translateX(0)' : 'translateX(-110%)' }}
      >
        <p className="bg-primary-cream p-5 mb-5 text-primary-pink">
          {status === 'error' ? "That didn't work, something's conked out" : 'Friends forever'}
        </p>
        <div className="flex items-center">
          <input
            className={`bg-primary-cream h-[42px] p-3 opacity-${status === 'success' ? '80' : '1'}`}
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === 'success'}
          />
          <button
            className="bg-primary-pink text-primary-cream w-[110px] h-[70px] relative"
            onClick={submitEmail}
          >
            <span className={`absolute text-lg top-3 right-${status === 'success' ? 3 : 10}`}>
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary-blue mt-1" />
              ) : status === 'success' ? (
                'THANKS'
              ) : (
                'OK'
              )}
            </span>
          </button>
        </div>
      </div>

      <div
        className="pt-5 pb-20 absolute transition-all duration-200 ease-in-out"
        style={{ transform: step === 1 ? 'translateX(0)' : 'translateX(-110%)' }}
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
