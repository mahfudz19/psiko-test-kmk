import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ItemButton } from '.'
// import Divider from '@/components/ui/Divider'

const Formatting = ({ editor }: { editor: Editor }) => {
  const [headingOpen, setHeadingOpen] = useState(false)
  const headingRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = headingRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) setHeadingOpen(false)
    }
    if (headingOpen) document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [headingOpen])

  const applyParagraph = () => {
    setHeadingOpen(false)
    ;(editor as any).chain().focus().setParagraph().run()
  }

  const applyHeading = (level: number) => {
    setHeadingOpen(false)
    ;(editor as any).chain().focus().toggleHeading({ level }).run()
  }

  // const applyCodeBlock = () => {
  //   setHeadingOpen(false)
  //   ;(editor as any).chain().focus().toggleCodeBlock().run()
  // }

  // const applyBlockquote = () => {
  //   setHeadingOpen(false)
  //   ;(editor as any).chain().focus().toggleBlockquote().run()
  // }

  const currentLabel = editor.isActive('heading', { level: 1 })
    ? 'H1'
    : editor.isActive('heading', { level: 2 })
      ? 'H2'
      : editor.isActive('heading', { level: 3 })
        ? 'H3'
        : editor.isActive('heading', { level: 4 })
          ? 'H4'
          : editor.isActive('heading', { level: 5 })
            ? 'H5'
            : editor.isActive('heading', { level: 6 })
              ? 'H6'
              : editor.isActive('codeBlock')
                ? 'Pre'
                : editor.isActive('blockquote')
                  ? 'Quote'
                  : 'Paragraph'

  const headingStyles = {
    1: 'text-2xl font-bold',
    2: 'text-xl font-bold',
    3: 'text-lg font-bold',
    4: 'text-base font-bold',
    5: 'text-sm font-bold',
    6: 'text-xs font-bold'
  }

  return (
    <div ref={headingRef} className='relative'>
      <ItemButton
        dropdown
        noCenterRipple
        onMouseDown={e => e.preventDefault()}
        onClick={() => setHeadingOpen(s => !s)}
        aria-haspopup='true'
        className='text-xs font-semibold px-2.5 h-8 min-w-[90px] bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 shadow-2xs'
        aria-expanded={headingOpen}
      >
        {currentLabel}
      </ItemButton>

      <div
        className={twMerge(
          'absolute mt-1.5 left-0 w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 text-slate-800',
          'transition-all duration-150 transform origin-top-left',
          headingOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <ItemButton
          subItem
          active={!editor.isActive('heading') && !editor.isActive('codeBlock') && !editor.isActive('blockquote')}
          onMouseDown={e => e.preventDefault()}
          onClick={applyParagraph}
        >
          <span className='flex items-center justify-between w-full'>
            <span className='text-sm'>Paragraph</span>
            <span className='text-xs text-slate-400 font-normal'>P</span>
          </span>
        </ItemButton>

        {[1, 2, 3, 4, 5, 6].map(l => (
          <ItemButton
            key={l}
            subItem
            active={editor.isActive('heading', { level: l })}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyHeading(l)}
          >
            <span className='flex items-center justify-between w-full'>
              <span className={headingStyles[l as keyof typeof headingStyles]}>Heading {l}</span>
              <span className='text-xs text-slate-400 font-normal'>H{l}</span>
            </span>
          </ItemButton>
        ))}
      </div>
    </div>
  )
}

export default Formatting
