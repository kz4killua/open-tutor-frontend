export default function SectionHeading({ children }) {
  return (
    <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
      { children }
    </h1>
  )
}