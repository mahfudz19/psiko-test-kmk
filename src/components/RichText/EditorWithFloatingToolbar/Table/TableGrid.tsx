import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { ItemButton } from '..'
import { twMerge } from 'tailwind-merge'

const TableIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' {...props}>
    <path
      fill='currentColor'
      d='M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm6-6H5v4h6zm2 0v4h6v-4zm-2-2V9H5v4zm2 0h6V9h-6zM5 7h14V5H5z'
    />
  </svg>
)

function TableGrid({ editor }: { editor: Editor }) {
  const maxCols = 10
  const maxRows = 8

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const [cols, setCols] = useState(0)
  const [rows, setRows] = useState(0)

  const onClick = (toggle?: boolean, open?: boolean) => {
    if (toggle) setOpen(s => !s)
    if (open !== undefined) setOpen(open)
    setCols(0)
    setRows(0)
  }

  const onConfirm = (rows: number, cols: number) => {
    onClick(false, false)
    editor.chain().focus().insertTable({ rows, cols }).run()
  }

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (!el.contains(e.target as Node)) {
        onClick(false, false)
      }
    }
    if (open) document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  return (
    <div ref={ref} className='relative'>
      <ItemButton
        dropdown
        active={open}
        onMouseDown={e => e.preventDefault()}
        onClick={() => onClick(true)}
        aria-haspopup='true'
        aria-expanded={open}
        title='Insert table'
      >
        <TableIcon />
      </ItemButton>

      <div
        className={twMerge(
          'absolute mt-1.5 left-0 p-3 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-max text-slate-700',
          'transition-all duration-150 transform origin-top-left',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className='text-xs font-semibold text-slate-700 mb-2.5'>
          Tabel — {rows} × {cols}
        </div>

        <div
          className='grid gap-1'
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 18px)`
          }}
          onClick={e => e.stopPropagation()}
        >
          {Array.from({ length: maxCols * maxRows }).map((_, i) => {
            const c = (i % maxCols) + 1
            const r = Math.floor(i / maxCols) + 1
            const active = r <= rows && c <= cols
            return (
              <button
                key={i}
                type='button'
                aria-label={`Select ${r} rows ${c} cols`}
                onMouseEnter={() => {
                  setRows(r)
                  setCols(c)
                }}
                onFocus={() => {
                  setRows(r)
                  setCols(c)
                }}
                onClick={() => onConfirm(r, c)}
                className={twMerge(
                  'w-4.5 h-4.5 rounded-xs border transition-colors cursor-pointer',
                  active ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                )}
                onMouseDown={e => e.preventDefault()}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TableGrid
