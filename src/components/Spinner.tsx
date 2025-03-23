import { FC } from 'react';

const Spinner: FC<{ color?: string }> = ({ color }) => {
  if (color === 'pink')
    return (
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary-pink mt-1" />
    );

  return <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary-cream mt-1" />;
};

export default Spinner;
