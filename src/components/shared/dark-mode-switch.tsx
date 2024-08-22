import clsx from 'clsx';
import React from 'react';
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from 'lucide-react';


export default function DarkModeSwitch({
  className,
}: {
  className?: string;
}) {

  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      onClick={toggleTheme}
      className={
        clsx(
          "z-50 p-3 rounded-full duration-300 ease-in-out",
          className
        )
      }
      aria-label="Toggle dark mode"
    >
      <MoonIcon className="hidden dark:block size-6 text-primary" />
      <SunIcon className="block dark:hidden size-6 text-primary" />
    </button>
  );
}