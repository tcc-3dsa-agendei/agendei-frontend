import { useEffect, useRef } from "react"

/** Move focus only after a user opens an editor or changes a step. */
export function useInterfaceFocus<T extends HTMLElement>(key: unknown, selector?: string) {
  const ref = useRef<T>(null)
  const previous = useRef(key)
  const pending = useRef(false)
  useEffect(() => {
    if (!Object.is(previous.current, key)) {
      previous.current = key
      pending.current = Boolean(key)
    }
    if (!pending.current) return
    const target = selector ? ref.current?.querySelector<HTMLElement>(selector) : ref.current
    if (target) {
      if (selector && !target.matches("input, select, textarea, button, a[href], [tabindex]"))
        target.tabIndex = -1
      target.focus()
      pending.current = false
    }
  })
  return ref
}
