import clsx from 'clsx';
import React from 'react';
import { useDarkMode } from '@/app/providers';
import { MoonIcon, SunIcon } from 'lucide-react';


export default function DarkModeSwitch({
  className,
}: {
  className?: string;
}) {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={
        clsx(
          "z-50 p-3 rounded-full duration-300 ease-in-out",
          className
        )
      }
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <MoonIcon className="h-6 w-6 text-primary" />
      ) : (
        <SunIcon className="h-6 w-6 text-primary" />
      )}
    </button>
  );
}