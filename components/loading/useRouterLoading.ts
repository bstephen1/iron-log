import { Router, useRouter } from 'next/router'
import Nprogress from 'nprogress'
import { useEffect, useState } from 'react'

// next doesn't export these for some reason
type Url = Parameters<Router['push']>[0]
type TransitionOptions = NonNullable<Parameters<Router['push']>[2]>

// Note that routerChangeStart will be on the current page, not the destination page.
// This means if you have a visible loading state on page A and click a link to navigate to page B,
// it will show as page A loading, not page B. This is noticeable in dev mode, but supposedly prod
// should have fast router transitions so it may not be an issue. If it is though, this hook can be
// extended with the router path so pages can check if their path matches.

/** Hook that watches the router state and broadcasts whether the router is currently transitioning.
 *
 *  In dev mode there can be a noticeable lag between transitions but this should not exist in prod.
 *  However, any pages that getServerSideProps will delay the router state until the server fetches data,
 *  so in those cases it can be useful to show a loader. Doing so allows us to take advantage of the
 *  increased speed of SSR while mitigating the big downside of slow router transitions while fetching data.
 */
export default function useRouterLoading() {
  // routeChangeStart is not called on first page load, only when navigating within the app.
  // router.isReady may be useful for first load but that seemed unreliable.
  const [isRouterLoading, setIsRouterLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleLoadingStart = (_: Url, { shallow }: TransitionOptions) => {
      // shallow routing cancels the route, triggering routeChangeError (error has "cancelled" set as true).
      // But by checking here first we can prevent loading from quickly toggling on and then back off
      if (shallow) return

      setIsRouterLoading(true)
      Nprogress.start()
    }
    const handleLoadingStop = () => {
      setIsRouterLoading(false)
      Nprogress.done()
    }

    router.events.on('routeChangeStart', handleLoadingStart)
    router.events.on('routeChangeComplete', handleLoadingStop)
    // on error the args are (err, url) instead of (url, options)
    router.events.on('routeChangeError', handleLoadingStop)

    return () => {
      router.events.off('routeChangeStart', handleLoadingStart)
      router.events.off('routeChangeComplete', handleLoadingStop)
      router.events.on('routeChangeError', handleLoadingStop)
    }
    // using router from app.tsx means it is not unmounted between page navigations
  }, [router])

  return isRouterLoading
}
