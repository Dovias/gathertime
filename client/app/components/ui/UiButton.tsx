import { ReactNode, MouseEventHandler } from 'react';

interface UiButtonProps {
  children: ReactNode;
  className?: string;
  size?: 'md' | 'lg';
  variant?: 'primary' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function UiButton({
  children,
  className = '',
  size = 'md',
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
}: UiButtonProps) {
  let sizeClass = '';
  if (size === 'md') sizeClass = 'rounded px-6 py-2 text-sm leading-tight';
  if (size === 'lg') sizeClass = 'rounded-lg px-5 py-3 leading-tight';

  let variantClass = '';
  if (variant === 'primary') variantClass = 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md';
  if (variant === 'outline') variantClass = 'border border-indigo-600 text-indigo-600 hover:border-indigo-500 hover:text-indigo-500';

  const buttonClassName = `w-full font-medium transition-all cursor-pointer ${sizeClass} ${variantClass} ${className}`;

  return (
    <button type={type} className={buttonClassName} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
