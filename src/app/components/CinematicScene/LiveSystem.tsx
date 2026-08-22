import { useEffect, useMemo, useRef, useState } from 'react'

type LiveEvent = {
  time: string
  label: string
  detail: string
}

const demoEvents: Omit<LiveEvent, 'time'>[] = [
  { label: 'Signal received', detail: 'WhatsApp enquiry detected' },
  { label: 'Memory loaded', detail: 'Customer context retrieved' },
  { label: 'AI reasoning', detail: 'Next-best action calculated' },
  { label: 'Workflow started', detail: 'Follow-up automation triggered' },
  { label: 'Task created', detail: 'Owner notified with action' },
]

function stamp() {
  return new Date().toLocaleTimeString([], { hour12: false })
}

export function LiveSystem() {
  const [index, setIndex] = useState(0)
  const [events, setEvents] = useState<LiveEvent[]>([])
  const indexRef = useRef(0)

  useEffect(() => {
    const push = () => {
      const next = demoEvents[indexRef.current % demoEvents.length]
      setEvents((current) => [{ ...next, time: stamp() }, ...current].slice(0, 4))
      indexRef.current += 1
      setIndex(indexRef.current)
    }

    push()
    const id = window.setInterval(push, 2200)
    return () => window.clearInterval(id)
  }, [])

  const status = useMemo(() => demoEvents[index % demoEvents.length].label, [index])

  return (
    <div className="live-system" aria-label="MW.AI live system demo">
      <div className="live-system-head">
        <span className="live-dot" />
        <span>MW.AI / LIVE</span>
        <strong>{status}</strong>
      </div>
      <div className="live-system-core">
        <div className="core-ring ring-a" />
        <div className="core-ring ring-b" />
        <div className="core-core">MW<span>.AI</span></div>
        <div className="core-node node-a">INPUT</div>
        <div className="core-node node-b">MEMORY</div>
        <div className="core-node node-c">AI</div>
        <div className="core-node node-d">ACTION</div>
      </div>
      <div className="live-events">
        {events.map((event) => (
          <div className="live-event" key={`${event.time}-${event.label}`}>
            <small>{event.time}</small>
            <div><strong>{event.label}</strong><span>{event.detail}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}
