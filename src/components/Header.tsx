import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white dark:bg-gray-800 text-black dark:text-white justify-between border-b border-gray-200 dark:border-gray-700">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/tanstack-query" className="hover:text-blue-600 dark:hover:text-blue-400">TanStack Query</Link>
        </div>
      </nav>
    </header>
  )
}
