export type DemoState = "default" | "loading" | "empty" | "error" | "long"

export function getDemoState(): DemoState {
  const state = new URLSearchParams(window.location.search).get("demo")

  if (
    state === "loading" ||
    state === "empty" ||
    state === "error" ||
    state === "long"
  ) {
    return state
  }

  return "default"
}

export function retryDemoState(retry: () => unknown) {
  const url = new URL(window.location.href)

  if (url.searchParams.get("demo") === "error") {
    url.searchParams.delete("demo")
    window.location.assign(url)
    return
  }

  retry()
}
