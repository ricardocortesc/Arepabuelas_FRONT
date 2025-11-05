import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-red-600 text-red-600 hover:bg-red-100",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-red-100 text-red-600",
    link: "text-red-600 underline-offset-4 hover:underline",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyle, variants[variant || 'default'], sizes[size || 'default'], className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button };