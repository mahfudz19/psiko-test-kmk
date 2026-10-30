import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ItemButton } from '.'

const UnorderedList: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='18' className='inline' height='18' viewBox='0 0 24 24' {...props}>
    <path
      fill='currentColor'
      d='M8 4h13v2H8zM4.5 6.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 7a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 6.9a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3M8 11h13v2H8zm0 7h13v2H8z'
    />
  </svg>
)

function UnorderedListDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (!el.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  const applyListType = async (listType: 'disc' | 'circle' | 'square') => {
    const isActive = editor.isActive('bulletList')
    const currentType = isActive ? (editor.getAttributes('bulletList')?.listType as string) || 'disc' : null

    if (isActive && currentType === listType) {
      editor.chain().focus().toggleBulletList().run()
      setOpen(false)
      return
    }

    if (isActive) {
      editor.chain().focus().updateAttributes('bulletList', { listType }).run()
      setOpen(false)
      return
    }

    editor.chain().focus().toggleBulletList().run()
    if (listType) {
      await new Promise(resolve => setTimeout(resolve, 10))
      editor.chain().focus().updateAttributes('bulletList', { listType }).run()
    }
    setOpen(false)
  }

  const currentType = (editor.isActive('bulletList') && editor.getAttributes('bulletList')?.listType) || ''

  return (
    <div ref={ref} className='relative'>
      <ItemButton
        dropdown
        active={editor.isActive('bulletList')}
        onMouseDown={e => e.preventDefault()}
        onClick={() => setOpen(s => !s)}
        aria-haspopup='true'
        aria-expanded={open}
        title='Bulleted list styles'
      >
        <UnorderedList />
      </ItemButton>

      <div
        className={twMerge(
          'absolute mt-1.5 left-0 flex gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-slate-700',
          'transition-all duration-150 transform origin-top-left',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <ItemButton
          subItem
          className='w-10 h-10 p-0 flex items-center justify-center rounded-lg hover:bg-slate-100'
          active={currentType === 'disc'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyListType('disc')}
          title='Disc bullets'
        >
          <svg height='36' width='36' viewBox='0 0 48 48' focusable='false'>
            <path d='M14 14a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm0 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm0 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'></path>
            <path d='M18 12h22v4H18zm0 10h22v4H18zm0 10h22v4H18z' opacity='.3'></path>
          </svg>
        </ItemButton>
        <ItemButton
          subItem
          className='w-10 h-10 p-0 flex items-center justify-center rounded-lg hover:bg-slate-100'
          active={currentType === 'circle'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyListType('circle')}
          title='Circle bullets'
        >
          <svg height='36' width='36' viewBox='0 0 48 48' focusable='false'>
            <path
              d='M8 14a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 24a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 34a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z'
              fillRule='evenodd'
            ></path>
            <path d='M18 12h22v4H18zm0 10h22v4H18zm0 10h22v4H18z' opacity='.3'></path>
          </svg>
        </ItemButton>
        <ItemButton
          subItem
          className='w-10 h-10 p-0 flex items-center justify-center rounded-lg hover:bg-slate-100'
          active={currentType === 'square'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyListType('square')}
          title='Square bullets'
        >
          <svg height='36' width='36' viewBox='0 0 48 48' focusable='false'>
            <path d='M8 21h6v6H8zm0 10h6v6H8zm0-20h6v6H8z'></path>
            <path d='M18 12h22v4H18zm0 10h22v4H18zm0 10h22v4H18z' opacity='.3'></path>
          </svg>
        </ItemButton>
      </div>
    </div>
  )
}
export default UnorderedListDropdown
