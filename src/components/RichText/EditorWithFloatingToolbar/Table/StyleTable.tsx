import { findParentNode } from '@tiptap/core'
import { Editor as EditorTitap } from '@tiptap/react'
import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'

// Definisikan tipe untuk gaya tabel
export interface TableStyles {
  tableWidth?: string
  borderColor?: string
  borderWidth?: string
}

function StyleTable(props: { open: boolean; setOpen: (open: boolean) => void; editor: EditorTitap }) {
  const { open, setOpen, editor } = props
  const [styles, setStyles] = useState<Partial<TableStyles>>({})

  useEffect(() => {
    if (open && editor) {
      const tableInfo = findParentNode(node => node.type.name === 'table')(editor.state.selection)
      if (tableInfo) {
        const tableAttrs = tableInfo.node.attrs

        setStyles({
          // Prioritaskan atribut, lalu DOM, lalu default 100%
          tableWidth: tableAttrs.tableWidth,
          borderColor: tableAttrs.borderColor,
          borderWidth: tableAttrs.borderWidth
        })
      }
    }
  }, [open, editor])

  const handleApply = () => {
    if (editor) {
      // Jika input lebar dikosongkan, simpan sebagai null
      const widthToSave = styles.tableWidth && styles.tableWidth.trim() !== '' ? styles.tableWidth : null

      // Perbarui state Tiptap
      editor
        .chain()
        .focus()
        .updateAttributes('table', {
          tableWidth: widthToSave,
          borderColor: styles.borderColor,
          borderWidth: styles.borderWidth
        })
        .run()

      // 🔥 PERBARUI DOM SECARA MANUAL - TARGET <table>, BUKAN <div.tableWrapper>
      requestAnimationFrame(() => {
        const tableInfo = findParentNode(node => node.type.name === 'table')(editor.state.selection)
        if (tableInfo) {
          try {
            const tableWrapperDOM = editor.view.nodeDOM(tableInfo.pos) as HTMLElement
            const tableElement = tableWrapperDOM?.querySelector('table') as HTMLTableElement | null

            if (tableElement) {
              // Terapkan atau hapus style lebar
              if (widthToSave) {
                tableElement.style.width = widthToSave
              } else {
                tableElement.style.removeProperty('width')
              }

              // Terapkan style border menggunakan CSS variables
              if (styles.borderColor) {
                tableElement.style.setProperty('--table-border-color', styles.borderColor)
              }
              if (styles.borderWidth) {
                tableElement.style.setProperty('--table-border-width', styles.borderWidth)
              }
            }

            // 🔥 JUGA UPDATE ATRIBUT DATA-* PADA WRAPPER UNTUK PERSISTENSI
            if (tableWrapperDOM) {
              if (widthToSave) {
                tableWrapperDOM.setAttribute('data-table-width', widthToSave)
              } else {
                tableWrapperDOM.removeAttribute('data-table-width')
              }
              if (styles.borderColor) {
                tableWrapperDOM.setAttribute('data-border-color', styles.borderColor)
              }
              if (styles.borderWidth) {
                tableWrapperDOM.setAttribute('data-border-width', styles.borderWidth)
              }
            }
          } catch {}
        }
      })
    }
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setStyles(prev => ({ ...prev, [id]: value }))
  }

  // const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target
  //   setStyles(prev => ({ ...prev, [id]: `${value}px` }))
  // }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} title='Style Table' closeButtom>
      <div className='px-4 pb-4 space-y-4'>
        {/* Table Width */}
        <div className='flex items-center justify-between'>
          <label htmlFor='tableWidth' className='text-sm min-w-[120px] flex justify-between'>
            <span>Table Width</span>
            <span>:</span>
          </label>
          <Input
            id='tableWidth'
            type='text'
            variant='underlined'
            fullWidth
            sizes='small'
            placeholder='e.g., 100% or 500px'
            value={styles.tableWidth || ''} // Pastikan input selalu terkontrol
            onChange={handleInputChange}
          />
        </div>

        {/* Border Width */}
        {/* <div className='flex items-center justify-between'>
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
        </div> */}

        {/* Border Color */}
        {/* <div className='flex items-center justify-between'>
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
        </div> */}

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

export default StyleTable
