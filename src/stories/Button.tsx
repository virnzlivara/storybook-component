import React from 'react';

import './button.css';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    // <button
    //   type="button"
    //   className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
    //   style={{ backgroundColor }}
    //   {...props}
    // >
    //   {label}
    // </button>
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    {label}
  </button>
  );
};
