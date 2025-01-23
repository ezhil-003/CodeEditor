

type Props = {}

export default function Notfound({}: Props) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 sm:py-16 lg:px-8 bg-white dark:bg-darkBg text-black dark:text-darkText"> {/* Improved layout and theming */}
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">404</p> {/* Themed accent color */}
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-indigo-600 dark:bg-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-300"
          >
            Go back home
          </a>
          <a href="#" className="font-semibold underline underline-offset-2"> {/* Underlined link */}
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  )
}