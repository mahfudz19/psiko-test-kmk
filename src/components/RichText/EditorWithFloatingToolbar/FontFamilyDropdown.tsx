import { Editor } from '@tiptap/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ItemButton } from '.'

// Tentukan font yang tersedia
const FONT_FAMILIES = [
  // Font Dasar
  { name: 'Default', value: '' },
  { name: 'Times New Roman', value: '"Times New Roman", Tinos, serif' },
  { name: 'Calibri', value: 'Calibri, Carlito, sans-serif' },

  // Pilihan Serif Lainnya (formal, klasik)
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Garamond', value: 'Garamond, serif' },

  // Pilihan Sans-Serif Lainnya (modern, bersih)
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },

  // Font Monospace (untuk kode atau tampilan mesin tik)
  { name: 'Courier New', value: '"Courier New", Courier, monospace' }
]

function FontFamilyDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  const applyFontFamily = (font: string | null) => {
    const { from, to } = editor.state.selection
    const chain = editor.chain().focus()

    // 1. Terapkan/hapus font family pada teks (membuat <span>)
    if (font) chain.setFontFamily(font)
    else chain.unsetFontFamily()

    // 🔥 GANTI LOGIKA: Iterasi semua node dalam seleksi
    // dan perbarui atribut `listItem` jika ditemukan.
    chain.command(({ tr }) => {
      editor.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === 'listItem') {
          // Gabungkan atribut yang ada dengan yang baru
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, fontFamily: font })
        }
      })
      return true // Wajib untuk melanjutkan chain
    })

    chain.run()
    setOpen(false)
  }

  const currentFont = useMemo(() => {
    // 🔥 UBAH: Baca atribut dari listItem dan textStyle
    const listItemFont = editor.getAttributes('listItem').fontFamily
    const textStyleFont = editor.getAttributes('textStyle').fontFamily
    const fontFamilyAttr = listItemFont || textStyleFont

    if (!fontFamilyAttr) return FONT_FAMILIES[0] // Default

    const font = FONT_FAMILIES.find(f => f.value.toLowerCase().startsWith(fontFamilyAttr.toLowerCase()))
    return font || { name: fontFamilyAttr.split(',')[0], value: fontFamilyAttr }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editor.state])

  return (
    <div ref={ref} className='relative'>
      <ItemButton
        dropdown
        active={currentFont.value !== ''}
        onMouseDown={e => e.preventDefault()}
        onClick={() => setOpen(s => !s)}
        className='w-36 text-xs font-semibold px-2.5 h-8 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 shadow-2xs truncate text-left'
      >
        <span className='truncate'>{currentFont.name}</span>
      </ItemButton>

      <div
        className={twMerge(
          'absolute mt-1.5 left-0 flex flex-col gap-0.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-44 max-h-64 overflow-y-auto text-slate-800',
          'transition-all duration-150 transform origin-top-left',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        {FONT_FAMILIES.map(font => (
          <ItemButton
            key={font.name}
            subItem
            active={currentFont.value === font.value}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyFontFamily(font.value || null)}
            style={{ fontFamily: font.value || 'inherit' }}
          >
            {font.name}
          </ItemButton>
        ))}
      </div>
    </div>
  )
}

export default FontFamilyDropdown
