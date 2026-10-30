import { Editor } from '@tiptap/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ItemButton } from '.'
import IconChevronDown from '@/components/ui/Icon/IconChevronDown'

const FONT_SIZES = ['9pt', '10pt', '11pt', '12pt', '14pt', '18pt', '24pt', '36pt']

function FontSizeDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  const applyFontSize = (size: string | null) => {
    const { from, to } = editor.state.selection
    const chain = editor.chain().focus()

    // 1. Terapkan/hapus font size pada teks (membuat <span>)
    if (size) chain.setFontSize(size)
    else chain.unsetFontSize()

    // 🔥 GANTI LOGIKA: Iterasi semua node dalam seleksi
    // dan perbarui atribut `listItem` jika ditemukan.
    chain.command(({ tr }) => {
      editor.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === 'listItem') {
          // Gabungkan atribut yang ada dengan yang baru
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, fontSize: size })
        }
      })
      return true // Wajib untuk melanjutkan chain
    })

    chain.run()
    setOpen(false)
  }

  const currentSize = useMemo(() => {
    const listItemSize = editor.getAttributes('listItem').fontSize
    const textStyleSize = editor.getAttributes('textStyle').fontSize
    return listItemSize || textStyleSize || 'Default'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editor.state])

  useEffect(() => {
    if (currentSize && currentSize !== 'Default') {
      const numericValue = parseInt(currentSize, 10)
      setInputValue(isNaN(numericValue) ? '' : numericValue.toString())
    } else {
      setInputValue('')
    }
  }, [currentSize])

  const handleApplyFromInput = () => {
    const num = parseInt(inputValue, 10)
    if (!isNaN(num) && num > 0) applyFontSize(`${num}pt`)
    else applyFontSize(null)
  }

  return (
    <div ref={ref} className='relative'>
      <div className='border border-slate-200 bg-white rounded-lg flex items-center h-8 text-xs font-semibold text-slate-700 px-1.5 shadow-2xs hover:border-slate-300'>
        <input
          type='text'
          className='bg-transparent border-none focus:outline-none w-7 text-center text-xs font-semibold text-slate-700'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={handleApplyFromInput}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleApplyFromInput()
            }
          }}
          placeholder='Size'
          title='Enter font size (pt)'
        />
        <span className='text-[10px] text-slate-400 select-none'>pt</span>
        <button
          type='button'
          className='h-full ml-1 pl-1 border-l border-slate-200 text-slate-500 hover:text-slate-800'
          onClick={() => setOpen(s => !s)}
          onMouseDown={e => e.preventDefault()}
          aria-haspopup='true'
          aria-expanded={open}
          title='Select font size'
        >
          <IconChevronDown fontSize={14} />
        </button>
      </div>

      <div
        className={twMerge(
          'absolute mt-1.5 left-0 flex flex-col gap-0.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-28 max-h-60 overflow-y-auto text-slate-800',
          'transition-all duration-150 transform origin-top-left',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <ItemButton
          subItem
          active={currentSize === 'Default'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyFontSize(null)}
        >
          Default
        </ItemButton>
        {FONT_SIZES.map(size => (
          <ItemButton
            key={size}
            subItem
            active={currentSize === size}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyFontSize(size)}
          >
            {size}
          </ItemButton>
        ))}
      </div>
    </div>
  )
}

export default FontSizeDropdown
