import { Editor } from '@tiptap/react'
import { useEffect, useMemo, useRef, useState, JSX } from 'react'
import { twMerge } from 'tailwind-merge'
import { ItemButton } from '.'
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from './icon'

type Alignment = 'left' | 'center' | 'right' | 'justify'

function TextAlignDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  // Logika untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  // Fungsi untuk menerapkan perataan teks
  const applyAlignment = (alignment: Alignment) => {
    editor.chain().focus().setTextAlign(alignment).run()
    setOpen(false)
  }

  // Tentukan perataan saat ini untuk menampilkan ikon yang benar
  const currentAlignment = useMemo<Alignment>(() => {
    if (editor.isActive({ textAlign: 'center' })) return 'center'
    if (editor.isActive({ textAlign: 'right' })) return 'right'
    if (editor.isActive({ textAlign: 'justify' })) return 'justify'
    return 'left' // Default ke kiri
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editor.state]) // Bergantung pada state editor untuk pembaruan

  // Objek untuk memetakan nama perataan ke komponen ikonnya
  const AlignmentIcons: Record<Alignment, JSX.Element> = {
    left: <AlignLeftIcon />,
    center: <AlignCenterIcon />,
    right: <AlignRightIcon />,
    justify: <AlignJustifyIcon />
  }

  return (
    <div ref={ref} className='relative'>
      <ItemButton
        dropdown
        active={
          editor.isActive({ textAlign: 'center' }) ||
          editor.isActive({ textAlign: 'right' }) ||
          editor.isActive({ textAlign: 'justify' })
        }
        onMouseDown={e => e.preventDefault()}
        onClick={() => setOpen(s => !s)}
        aria-haspopup='true'
        aria-expanded={open}
        title='Text alignment'
      >
        {AlignmentIcons[currentAlignment]}
      </ItemButton>

      <div
        className={twMerge(
          'absolute mt-1.5 left-0 flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-slate-700',
          'transition-all duration-150 transform origin-top-left',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <ItemButton
          subItem
          active={currentAlignment === 'left'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyAlignment('left')}
          title='Align Left'
        >
          <AlignLeftIcon />
        </ItemButton>
        <ItemButton
          subItem
          active={currentAlignment === 'center'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyAlignment('center')}
          title='Align Center'
        >
          <AlignCenterIcon />
        </ItemButton>
        <ItemButton
          subItem
          active={currentAlignment === 'right'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyAlignment('right')}
          title='Align Right'
        >
          <AlignRightIcon />
        </ItemButton>
        <ItemButton
          subItem
          active={currentAlignment === 'justify'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyAlignment('justify')}
          title='Align Justify'
        >
          <AlignJustifyIcon />
        </ItemButton>
      </div>
    </div>
  )
}

export default TextAlignDropdown
