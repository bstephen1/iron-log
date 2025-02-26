import { useEffect, useRef } from 'react'
import { State } from 'swr'

// useSwr has a currently open issue where the cache cannot be loaded from localStorage
// on init with nextjs because it causes a hydration error.
// This hook is a workaround from the github issue here: https://github.com/vercel/swr/issues/2125
// Warning: this may not be an ideal solution. UseSWR cautions against directly writing to the cache.
// Using the suggested mutate() from useSWRConfig() doesn't work though.
// An alternative is to wrap <SWRConfig> in a state variable that gets set to true on client
// mount, but this removes all SSR so is not ideal.
// This solution does appear to be working fine, and it doesn't seem like it should cause issues because
// we are only writing to the cache during init, when the cache is empty.
export default function useSWRCacheProvider() {
  const cache = useRef<Map<string, State>>(new Map())

  // triggers on client side, preventing hydration error
  useEffect(() => {
    const savedAppCache: [key: string, value: object][] = JSON.parse(
      localStorage.getItem('app-cache') || '[]'
    )
    savedAppCache.forEach(([key, value]) => cache.current.set(key, value))

    const saveCache = () => {
      if (document.visibilityState !== 'hidden') return

      const appCache = JSON.stringify(Array.from(cache.current.entries()))
      localStorage.setItem('app-cache', appCache)
    }

    // swr's example has the listener on beforeUnload, but according to mdn docs
    // this is unreliable and won't trigger on all situations, especially on mobile.
    // Instead, visibilityChange should be used. See: https://developer.chrome.com/blog/page-lifecycle-api/#legacy-lifecycle-apis-to-avoid
    window.addEventListener('visibilitychange', saveCache)
    return () => window.removeEventListener('visibilityChange', saveCache)
  }, [])

  return () => cache.current
}
