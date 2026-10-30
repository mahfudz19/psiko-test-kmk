import { Editor as EditorTitap } from '@tiptap/react'
import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'

// Definisikan tipe untuk gaya sel
export interface CellStyles {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: string
  padding?: string
}

function StyleCell(props: { open: boolean; setOpen: (open: boolean) => void; editor: EditorTitap }) {
  const { open, setOpen, editor } = props
  const [styles, setStyles] = useState<Partial<CellStyles>>({})

  useEffect(() => {
    if (open && editor) {
      const cellAttrs = editor.getAttributes('tableCell') || editor.getAttributes('tableHeader') || {}
      setStyles({
        backgroundColor: cellAttrs.backgroundColor,
        borderColor: cellAttrs.borderColor,
        borderWidth: cellAttrs.borderWidth,
        padding: cellAttrs.padding
      })
    }
  }, [open, editor])

  const handleApply = () => {
    if (editor) {
      const cleanStyles: Partial<CellStyles> = {} // Gunakan Partial agar lebih aman
      if (styles.backgroundColor) cleanStyles.backgroundColor = styles.backgroundColor
      if (styles.borderColor) cleanStyles.borderColor = styles.borderColor
      if (styles.borderWidth) cleanStyles.borderWidth = styles.borderWidth
      if (styles.padding) cleanStyles.padding = styles.padding

      // update model
      editor
        .chain()
        .focus()
        .updateAttributes('tableCell', cleanStyles)
        .updateAttributes('tableHeader', cleanStyles)
        .run()

      // apply to DOM for all selected cells (fallback visual update)
      requestAnimationFrame(() => {
        const sel = editor.state.selection
        const applied = new Set<number>()

        sel.ranges.forEach((range: any) => {
          editor.state.doc.nodesBetween(range.$from.pos, range.$to.pos, (node, pos) => {
            if (!node) return
            const typeName = node.type?.name
            if ((typeName === 'tableCell' || typeName === 'tableHeader') && !applied.has(pos)) {
              applied.add(pos)
              try {
                let dom = editor.view.nodeDOM(pos) as HTMLElement | null
                // sometimes nodeDOM returns a child; find closest td/th
                const cellEl =
                  dom && (dom.nodeName === 'TD' || dom.nodeName === 'TH')
                    ? dom
                    : (dom?.closest?.('td,th') as HTMLElement | null)
                if (cellEl) {
                  if (cleanStyles.backgroundColor) cellEl.style.backgroundColor = cleanStyles.backgroundColor
                  if (cleanStyles.borderColor) cellEl.style.borderColor = cleanStyles.borderColor
                  if (cleanStyles.borderWidth) cellEl.style.borderWidth = cleanStyles.borderWidth
                  if (cleanStyles.padding) cellEl.style.padding = cleanStyles.padding
                }
              } catch {
                // ignore
              }
            }
          })
        })
      })
    }
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setStyles(prev => ({ ...prev, [id]: value }))
  }

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setStyles(prev => ({ ...prev, [id]: `${value}px` }))
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} title='Style Cell' closeButtom>
      <div className='px-4 pb-4 space-y-4'>
        {/* Background Color */}
        <div className='flex items-center justify-between'>
          <label htmlFor='backgroundColor' className='text-sm min-w-[120px] flex justify-between'>
            <span>Background Color</span>
            <span>:</span>
          </label>
          <Input
            id='backgroundColor'
            type='color'
            variant='underlined'
            fullWidth
            sizes='small'
            value={styles.backgroundColor}
            onChange={handleInputChange}
          />
        </div>

        {/* Padding */}
        <div className='flex items-center justify-between'>
          <label htmlFor='padding' className='text-sm min-w-[120px] flex justify-between'>
            <span>Padding (px)</span>
            <span>:</span>
          </label>
          <Input
            id='padding'
            type='number'
            variant='underlined'
            fullWidth
            sizes='small'
            value={styles.padding ? parseInt(styles.padding, 10) : undefined}
            onChange={handleNumericInputChange}
            min={0}
          />
        </div>

        {/* Border Width */}
        <div className='flex items-center justify-between'>
          <label htmlFor='borderWidth' className='text-sm min-w-[120px] flex justify-between'>
            <span>Border Width (px)</span>
            <span>:</span>
          </label>
          <Input
            id='borderWidth'
            type='number'
            variant='underlined'
            fullWidth
            sizes='small'
            value={styles.borderWidth ? parseInt(styles.borderWidth, 10) : undefined}
            onChange={handleNumericInputChange}
          />
        </div>

        {/* Border Color */}
        <div className='flex items-center justify-between'>
          <label htmlFor='borderColor' className='text-sm min-w-[120px] flex justify-between'>
            <span>Border Color</span>
            <span>:</span>
          </label>
          <Input
            id='borderColor'
            type='color'
            variant='underlined'
            fullWidth
            sizes='small'
            value={styles.borderColor}
            onChange={handleInputChange}
          />
        </div>

        {/* Tombol Aksi */}
        <div className='text-right'>
          <Button type='button' onClick={() => setOpen(false)} variant='outlined' color='warning' sizes='small'>
            Cancel
          </Button>{' '}
          <Button type='button' onClick={handleApply} sizes='small'>
            Apply
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default StyleCell
