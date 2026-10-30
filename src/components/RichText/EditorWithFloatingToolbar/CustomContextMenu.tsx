import { Editor } from '@tiptap/react'
import { CustomContextMenuItem } from '..'
import MenuItem from '@/components/ui/Menu/MenuItem'

interface Props {
  editor: Editor
  top: number
  left: number
  items: CustomContextMenuItem[]
  onClose: () => void
}

export default function CustomContextMenu({ editor, top, left, items, onClose }: Props) {
  const handleAction = (action: (editor: Editor) => void) => {
    action(editor)
    onClose()
  }

  return (
    <>
      {/* Backdrop untuk menutup menu saat diklik di luar */}
      <div className='fixed inset-0 z-40' onClick={onClose} onContextMenu={e => e.preventDefault()} />
      <div
        className='absolute z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[200px]'
        style={{ top, left }}
      >
        {items.map(item => (
          <MenuItem
            key={item.id}
            onClick={() => handleAction(item.action)}
            iconStart={item.icon}
            className='rounded-none'
          >
            {item.label}
          </MenuItem>
        ))}
      </div>
    </>
  )
}
