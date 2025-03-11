import { FC } from 'react';

interface ErrorHandlerProps {
  error: Error;
}

export const ErrorHandler: FC<ErrorHandlerProps> = ({ error }) => {
  return (
    <div role="alert" className="text-red-600">
      {error.message}
    </div>
  );
}; 