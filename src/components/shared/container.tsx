import clsx from "clsx"


export default function Container({
  children, className
}: {
  children: React.ReactNode,
  className?: string
}) {
  return (
    <div 
      className={clsx(
        "max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-8", 
        className
      )}
    >
      {children}
    </div>
  )
}