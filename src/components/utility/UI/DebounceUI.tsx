import { DependencyList, Dispatch, SetStateAction, useCallback } from 'react'

export const debounceRef = (func: Function, ref: React.MutableRefObject<NodeJS.Timeout | null>, delay = 1000) => {
  if (ref.current) {
    clearTimeout(ref.current)
  }

  ref.current = setTimeout(() => {
    func()
  }, delay)
}

export function DebounceCallback(
  func: any,
  ms?: number,
  setLoad?: Dispatch<SetStateAction<boolean>>,
  rerender?: DependencyList
) {
  const deps = rerender ? rerender : []
  const debounce = (fn: any, ms = 1000) => {
    let timeoutId: ReturnType<typeof setTimeout>

    return function (this: unknown, ...args: never[]) {
      if (setLoad) setLoad(true)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useDebounce = useCallback<any>(debounce(func, ms), deps)

  return useDebounce
}
