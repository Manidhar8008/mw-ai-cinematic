import { useEffect } from 'react'

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

type GtagWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

export function Analytics({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled || !GA_ID || document.querySelector(`script[data-mw-ga="${GA_ID}"]`)) return

    const win = window as GtagWindow
    win.dataLayer = win.dataLayer || []
    win.gtag = (...args: unknown[]) => win.dataLayer?.push(args)
    win.gtag('js', new Date())
    win.gtag('config', GA_ID, { anonymize_ip: true })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
    script.dataset.mwGa = GA_ID
    document.head.appendChild(script)
  }, [enabled])

  return null
}
