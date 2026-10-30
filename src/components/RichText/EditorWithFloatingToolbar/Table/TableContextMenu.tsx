import { Editor as EditorTitap } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import Divider from '@/components/ui/Divider'
import MenuI from '@/components/ui/Menu/MenuItem'
import { twMerge } from 'tailwind-merge'

// Icon Components
const Icons = {
  RowBefore: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='18' height='5' rx='1' />
      <rect x='3' y='12' width='18' height='9' rx='1' opacity='0.3' />
      <path d='M12 3L12 8' strokeLinecap='round' />
    </svg>
  ),
  RowAfter: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='18' height='9' rx='1' opacity='0.3' />
      <rect x='3' y='16' width='18' height='5' rx='1' />
      <path d='M12 16L12 21' strokeLinecap='round' />
    </svg>
  ),
  DeleteRow: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='9' width='18' height='6' rx='1' />
      <path d='M8 12L16 12' strokeLinecap='round' />
    </svg>
  ),
  ColumnBefore: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='5' height='18' rx='1' />
      <rect x='12' y='3' width='9' height='18' rx='1' opacity='0.3' />
      <path d='M3 12L8 12' strokeLinecap='round' />
    </svg>
  ),
  ColumnAfter: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='9' height='18' rx='1' opacity='0.3' />
      <rect x='16' y='3' width='5' height='18' rx='1' />
      <path d='M16 12L21 12' strokeLinecap='round' />
    </svg>
  ),
  DeleteColumn: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='9' y='3' width='6' height='18' rx='1' />
      <path d='M12 8L12 16' strokeLinecap='round' />
    </svg>
  ),
  MergeCells: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='8' height='8' rx='1' />
      <rect x='13' y='3' width='8' height='8' rx='1' />
      <path d='M8 7L13 7M16 7L11 7' strokeLinecap='round' />
      <path d='M14 5L11 7L14 9' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  SplitCell: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='18' height='8' rx='1' />
      <path d='M12 3L12 11' strokeLinecap='round' strokeDasharray='2 2' />
      <path d='M8 7L13 7M16 7L11 7' strokeLinecap='round' />
      <path d='M10 5L13 7L10 9' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  DeleteTable: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='18' height='18' rx='1' />
      <path d='M3 9L21 9M3 15L21 15M9 3L9 21M15 3L15 21' opacity='0.5' />
      <path d='M8 8L16 16M16 8L8 16' strokeLinecap='round' />
    </svg>
  ),
  StyleCell: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='18' height='18' rx='1' />
      <path d='M9 9h6v6H9z' />
      <circle cx='12' cy='12' r='1.5' fill='currentColor' />
    </svg>
  ),
  // Tambahkan ikon baru ini
  StyleTable: () => (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='3' y='3' width='18' height='18' rx='1' />
      <path d='M3 9L21 9' />
      <path d='M16 19l-2.5-2.5M17.5 13.5l3-3' strokeLinecap='round' />
      <path d='M20.5 16.5l-3 3' strokeLinecap='round' />
    </svg>
  )
}

const AlignmentIcons = {
  AlignTopLeft: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      {/* Border kotak */}
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di atas-kiri */}
      <line x1='3' y1='3' x2='9' y2='3' stroke='currentColor' strokeWidth='1.5' />
      <line x1='3' y1='5' x2='7' y2='5' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignTopCenter: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di atas-tengah */}
      <line x1='5' y1='3' x2='11' y2='3' stroke='currentColor' strokeWidth='1.5' />
      <line x1='6' y1='5' x2='10' y2='5' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignTopRight: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di atas-kanan */}
      <line x1='7' y1='3' x2='13' y2='3' stroke='currentColor' strokeWidth='1.5' />
      <line x1='9' y1='5' x2='13' y2='5' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignMiddleLeft: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di tengah-kiri */}
      <line x1='3' y1='7' x2='9' y2='7' stroke='currentColor' strokeWidth='1.5' />
      <line x1='3' y1='9' x2='7' y2='9' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignCenter: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di tengah-tengah */}
      <line x1='5' y1='7' x2='11' y2='7' stroke='currentColor' strokeWidth='1.5' />
      <line x1='6' y1='9' x2='10' y2='9' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignMiddleRight: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di tengah-kanan */}
      <line x1='7' y1='7' x2='13' y2='7' stroke='currentColor' strokeWidth='1.5' />
      <line x1='9' y1='9' x2='13' y2='9' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignBottomLeft: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di bawah-kiri */}
      <line x1='3' y1='11' x2='9' y2='11' stroke='currentColor' strokeWidth='1.5' />
      <line x1='3' y1='13' x2='7' y2='13' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignBottomCenter: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di bawah-tengah */}
      <line x1='5' y1='11' x2='11' y2='11' stroke='currentColor' strokeWidth='1.5' />
      <line x1='6' y1='13' x2='10' y2='13' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  AlignBottomRight: () => (
    <svg viewBox='0 0 16 16' className='w-4 h-4' fill='currentColor'>
      <rect x='1' y='1' width='14' height='14' fill='none' stroke='currentColor' strokeWidth='1' />
      {/* Garis teks di bawah-kanan */}
      <line x1='7' y1='11' x2='13' y2='11' stroke='currentColor' strokeWidth='1.5' />
      <line x1='9' y1='13' x2='13' y2='13' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  )
}

type Props = {
  editor: EditorTitap
  top: number
  left: number
  onClose: () => void
  dialogStyleCell: () => void
  dialogStyleTable: () => void // <-- Tambahkan prop ini
}
export default function TableContextMenu(props: Props) {
  const { editor, top, left, onClose, dialogStyleCell, dialogStyleTable } = props // <-- Tambahkan ini
  const [cellAttrs, setCellAttrs] = useState<Record<string, any>>({})

  useEffect(() => {
    const attrs = editor.getAttributes('tableCell') || editor.getAttributes('tableHeader')
    setCellAttrs(attrs)
  }, [editor])

  const actions = {
    addRowBefore: () => editor.chain().focus().addRowBefore().run(),
    addRowAfter: () => editor.chain().focus().addRowAfter().run(),
    deleteRow: () => editor.chain().focus().deleteRow().run(),
    addColumnBefore: () => editor.chain().focus().addColumnBefore().run(),
    addColumnAfter: () => editor.chain().focus().addColumnAfter().run(),
    deleteColumn: () => editor.chain().focus().deleteColumn().run(),
    deleteTable: () => editor.chain().focus().deleteTable().run(),
    mergeCells: () => (editor as any).chain().focus().mergeCells().run(),
    splitCell: () => (editor as any).chain().focus().splitCell().run()
  }

  const handleSetAlignment = (verticalAlign: string, textAlign: string) => {
    editor
      .chain()
      .focus()
      .updateAttributes('tableCell', { verticalAlign, textAlign })
      .updateAttributes('tableHeader', { verticalAlign, textAlign })
      .run()
    onClose()
  }

  const canMerge = editor.can().mergeCells()
  const canSplit = editor.can().splitCell()
  const hasCellSelected = (editor as any).state.selection.ranges.some((range: any) => {
    const fromNode = range.$from.node(range.$from.depth)
    const toNode = range.$to.node(range.$to.depth)
    return (
      fromNode?.type.name === 'tableCell' ||
      fromNode?.type.name === 'tableHeader' ||
      toNode?.type.name === 'tableCell' ||
      toNode?.type.name === 'tableHeader'
    )
  })

  const MenuItem = (props: { label: string; action: () => void; icon: React.ComponentType }) => {
    const { label, action, icon: Icon } = props
    return (
      <MenuI
        className='rounded-none text-sm'
        type='button'
        onClick={() => {
          action()
          onClose()
        }}
        iconStart={<Icon />}
      >
        {label}
      </MenuI>
    )
  }

  const AlignmentButton = ({ vAlign, hAlign, Icon }: { vAlign: string; hAlign: string; Icon: React.ComponentType }) => {
    const isActive = cellAttrs.verticalAlign === vAlign && cellAttrs.textAlign === hAlign
    return (
      <button
        type='button'
        onClick={() => handleSetAlignment(vAlign, hAlign)}
        className={twMerge(
          'flex items-center justify-center p-1 rounded hover:bg-primary-main/10',
          isActive && 'bg-primary-main/20 text-primary-main'
        )}
      >
        <Icon />
      </button>
    )
  }

  const menuRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState({ top, left })

  useEffect(() => {
    const adjustPosition = () => {
      const el = menuRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const margin = 8
      const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin)
      const maxTop = Math.max(margin, window.innerHeight - rect.height - margin)
      const clampedLeft = Math.min(Math.max(left, margin), maxLeft)
      const clampedTop = Math.min(Math.max(top, margin), maxTop)
      setPos({ top: clampedTop, left: clampedLeft })
    }
    requestAnimationFrame(adjustPosition)
  }, [top, left])

  return (
    <>
      <div
        className='fixed inset-0 z-40'
        onClick={onClose}
        onContextMenu={e => {
          e.preventDefault()
          onClose()
        }}
      />
      <Card
        ref={menuRef}
        style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px` }}
        className='z-50 w-52 py-1 bg-white border border-slate-200 rounded-xl shadow-xl'
      >
        <MenuItem label='Add Row Before' action={actions.addRowBefore} icon={Icons.RowBefore} />
        <MenuItem label='Add Row After' action={actions.addRowAfter} icon={Icons.RowAfter} />
        <MenuItem label='Delete Row' action={actions.deleteRow} icon={Icons.DeleteRow} />
        <Divider />
        <MenuItem label='Add Column Before' action={actions.addColumnBefore} icon={Icons.ColumnBefore} />
        <MenuItem label='Add Column After' action={actions.addColumnAfter} icon={Icons.ColumnAfter} />
        <MenuItem label='Delete Column' action={actions.deleteColumn} icon={Icons.DeleteColumn} />

        {(canMerge || canSplit) && <Divider />}
        {canMerge && <MenuItem label='Merge Cells' action={actions.mergeCells} icon={Icons.MergeCells} />}
        {canSplit && <MenuItem label='Split Cell' action={actions.splitCell} icon={Icons.SplitCell} />}

        <Divider />
        <MenuItem label='Delete Table' action={actions.deleteTable} icon={Icons.DeleteTable} />
        {hasCellSelected && (
          <>
            <Divider />
            <div className='px-3 pt-2 pb-1 text-xs font-semibold text-text-secondary'>Cell Alignment</div>
            <div className='grid grid-cols-3 gap-1 px-2 pb-1'>
              <AlignmentButton vAlign='top' hAlign='left' Icon={AlignmentIcons.AlignTopLeft} />
              <AlignmentButton vAlign='top' hAlign='center' Icon={AlignmentIcons.AlignTopCenter} />
              <AlignmentButton vAlign='top' hAlign='right' Icon={AlignmentIcons.AlignTopRight} />
              <AlignmentButton vAlign='middle' hAlign='left' Icon={AlignmentIcons.AlignMiddleLeft} />
              <AlignmentButton vAlign='middle' hAlign='center' Icon={AlignmentIcons.AlignCenter} />
              <AlignmentButton vAlign='middle' hAlign='right' Icon={AlignmentIcons.AlignMiddleRight} />
              <AlignmentButton vAlign='bottom' hAlign='left' Icon={AlignmentIcons.AlignBottomLeft} />
              <AlignmentButton vAlign='bottom' hAlign='center' Icon={AlignmentIcons.AlignBottomCenter} />
              <AlignmentButton vAlign='bottom' hAlign='right' Icon={AlignmentIcons.AlignBottomRight} />
            </div>
            <MenuItem label='Style Cell...' action={dialogStyleCell} icon={Icons.StyleCell} />
          </>
        )}
        <MenuItem label='Style Table...' action={dialogStyleTable} icon={Icons.StyleTable} />
      </Card>
    </>
  )
}
