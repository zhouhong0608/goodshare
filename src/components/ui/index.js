// UI组件库 - 简化实现
import React from 'react';

// Button 组件
export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  disabled, 
  className = '', 
  type = 'button',
  onClick,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-8',
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Input 组件
export function Input({ 
  className = '', 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

// Textarea 组件
export function Textarea({ 
  className = '', 
  placeholder,
  value,
  onChange,
  rows = 3,
  disabled,
  ...props 
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{minHeight: '80px'}}
      {...props}
    />
  );
}

// Badge 组件
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-700',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Avatar 组件
export function Avatar({ className = '', children }) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, className = '' }) {
  return (
    <img 
      src={src} 
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className}`}
    />
  );
}

export function AvatarFallback({ children, className = '' }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 ${className}`}>
      {children}
    </div>
  );
}

// Select 组件
export function Select({ children, onValueChange, value }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export function SelectTrigger({ children, className = '' }) {
  return (
    <button className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }) {
  return (
    <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-gray-950 shadow-md">
      {children}
    </div>
  );
}

export function SelectItem({ children, value }) {
  return (
    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 hover:bg-gray-100">
      {children}
    </div>
  );
}

// Card 组件
export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}

// Dialog 组件
export function Dialog({ children, open, onOpenChange }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80" onClick={() => onOpenChange?.(false)} style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
      <div className="center-absolute">
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogContent({ children, className = '' }) {
  return (
    <div className={`grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg rounded-lg overflow-y-auto ${className}`} style={{maxHeight: '90vh'}}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '' }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
}

export function DialogTrigger({ children }) {
  return children;
}

// Form 组件 (简化版，与 react-hook-form 兼容)
export function Form({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function FormField({ control, name, rules, render }) {
  // 简化版，在实际项目中应该与 react-hook-form 集成
  const field = { name, value: '', onChange: () => {} };
  return render({ field });
}

export function FormItem({ children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}

export function FormLabel({ children, className = '' }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
}

export function FormControl({ children }) {
  return <div>{children}</div>;
}

export function FormMessage({ children, className = '' }) {
  if (!children) return null;
  return (
    <p className={`text-sm font-medium text-red-500 ${className}`}>
      {children}
    </p>
  );
}

// Toast Hook
export function useToast() {
  return {
    toast: ({ title, description, variant }) => {
      console.log(`Toast (${variant || 'default'}): ${title} - ${description}`);
      // 在实际项目中，这里应该显示真实的toast通知
    }
  };
}