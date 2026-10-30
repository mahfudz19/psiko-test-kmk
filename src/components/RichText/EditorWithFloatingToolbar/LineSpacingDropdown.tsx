import { Editor } from '@tiptap/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Divider from '@/components/ui/Divider'
import { twMerge } from 'tailwind-merge'
import { ItemButton } from '.'

const LineSpacingIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' {...props}>
    <path
      fill='currentColor'
      d='M7.29 7c.45 0 .67-.54.35-.85l-2.29-2.3c-.2-.2-.51-.2-.71 0l-2.29 2.3a.5.5 0 0 0 .36.85H4v10H2.71c-.45 0-.67.54-.35.85l2.29 2.29c.2.2.51.2.71 0l2.29-2.29a.5.5 0 0 0-.36-.85H6V7zM11 7h10c.55 0 1-.45 1-1s-.45-1-1-1H11c-.55 0-1 .45-1 1s.45 1 1 1m10 10H11c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1m0-6H11c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1'
    />
  </svg>
)

const LINE_HEIGHTS = ['1', '1.15', '1.5', '2']
const PARAGRAPH_SPACING = ['0pt', '8pt', '16pt', '24pt']

function LineSpacingDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  const applySpacing = (property: string, value: string | null) => {
    editor
      .chain()
      .focus()
      .setLineHeight({ [property]: value } as any)
      .run()
  }

  const getActiveAttributes = () => {
    const { state } = editor
    const { from } = state.selection
    const node = state.doc.nodeAt(from)

    if (node) {
      const parent = node.isBlock ? node : state.doc.resolve(from).parent
      return parent.attrs
    }
    return {}
  }

  const currentAttributes = useMemo(() => {
    return getActiveAttributes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editor.state])

  return (
    <div ref={ref} className='relative'>
      <ItemButton
        dropdown
        onMouseDown={e => e.preventDefault()}
        onClick={() => setOpen(s => !s)}
        aria-haspopup='true'
        aria-expanded={open}
        title='Line & Paragraph Spacing'
      >
        <LineSpacingIcon />
      </ItemButton>

      <div
        className={twMerge(
          'absolute mt-1.5 left-0 flex flex-col gap-0.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-56 text-slate-700',
          'transition-all duration-150 transform origin-top-left',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className='text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5'>Line Spacing</div>
        {LINE_HEIGHTS.map(height => (
          <ItemButton
            key={height}
            subItem
            active={currentAttributes.lineHeight === height}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applySpacing('lineHeight', height)}
          >
            {height}
          </ItemButton>
        ))}
        <div className='h-px bg-slate-100 my-1' />
        <div className='text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5'>Space Before Paragraph</div>
        {PARAGRAPH_SPACING.map(space => (
          <ItemButton
            key={`mt-${space}`}
            subItem
            active={currentAttributes.marginTop === space}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applySpacing('marginTop', space)}
          >
            {space}
          </ItemButton>
        ))}
        <div className='h-px bg-slate-100 my-1' />
        <div className='text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5'>Space After Paragraph</div>
        {PARAGRAPH_SPACING.map(space => (
          <ItemButton
            key={`mb-${space}`}
            subItem
            active={currentAttributes.marginBottom === space}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applySpacing('marginBottom', space)}
          >
            {space}
          </ItemButton>
        ))}
      </div>
    </div>
  )
}

export default LineSpacingDropdown
