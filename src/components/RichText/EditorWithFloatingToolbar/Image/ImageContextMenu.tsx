import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import IconDelete from '@/components/ui/Icon/IconDelete'
import IconLock from '@/components/ui/Icon/IconLock'
import IconRefresh from '@/components/ui/Icon/IconRefresh'
import IconUnlock from '@/components/ui/Icon/IconUnlock'
import MenuItem from '@/components/ui/Menu/MenuItem'
import { twMerge } from 'tailwind-merge'

interface ImageContextMenuProps {
  editor: Editor
  top: number
  left: number
  onClose: () => void
  nodePos: number
}

export default function ImageContextMenu({ editor, top, left, onClose, nodePos }: ImageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const [imageAttrs, setImageAttrs] = useState<Record<string, any>>({})

  useEffect(() => {
    if (nodePos >= 0) {
      editor.commands.setNodeSelection(nodePos)

      setTimeout(() => {
        const attrs = editor.getAttributes('image')
        setImageAttrs(attrs)
      }, 0)
    }
  }, [editor, nodePos])

  const currentMode = imageAttrs.mode || 'inline'
  const currentZPosition = imageAttrs.zPosition || 'front'
  const isFreeMove = currentMode === 'freeMove'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    if (!menuRef.current) return

    const rect = menuRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let adjustedTop = top
    let adjustedLeft = left

    if (rect.right > viewportWidth) {
      adjustedLeft = viewportWidth - rect.width - 10
    }

    if (rect.bottom > viewportHeight) {
      adjustedTop = viewportHeight - rect.height - 10
    }

    if (adjustedTop !== top || adjustedLeft !== left) {
      menuRef.current.style.top = `${adjustedTop}px`
      menuRef.current.style.left = `${adjustedLeft}px`
    }
  }, [top, left])

  const handleToggleMode = () => {
    const newMode = currentMode === 'inline' ? 'freeMove' : 'inline'

    editor.commands.setNodeSelection(nodePos)
    editor.commands.setImageMode(newMode)

    if (newMode === 'inline') {
      editor.commands.setImagePosition({ x: 0, y: 0 })
      editor.commands.setImageZPosition('front')
    }

    onClose()
  }

  const handleSetZPosition = (zPosition: 'behind' | 'front') => {
    editor.commands.setNodeSelection(nodePos)
    editor.commands.setImageZPosition(zPosition)
    onClose()
  }

  const handleReplaceImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string

        editor.commands.setNodeSelection(nodePos)
        editor.commands.updateAttributes('image', {
          src: base64,
          alt: file.name,
          title: file.name
        })
        onClose()
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }

  const handleDeleteImage = () => {
    const ok = window.confirm('Delete this image?')
    if (!ok) return

    editor.commands.setNodeSelection(nodePos)
    editor.commands.deleteSelection()
    onClose()
  }

  return (
    <Card
      ref={menuRef}
      className='overflow-hidden bg-white border border-slate-200 shadow-xl rounded-xl py-1 text-slate-800'
      style={{
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 1000,
        maxWidth: '210px'
      }}
    >
      <div className='text-xs font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1'>Gambar Options</div>
      <div className='h-px bg-slate-100 my-1' />

      {isFreeMove && (
        <>
          <div className='px-3 pt-1.5 pb-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Layer</div>
          <MenuItem
            iconStart={<span style={{ fontSize: '15px' }}>📄</span>}
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              currentZPosition === 'behind'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => handleSetZPosition('behind')}
          >
            Di belakang teks {currentZPosition === 'behind' && '✓'}
          </MenuItem>
          <MenuItem
            iconStart={<span style={{ fontSize: '15px' }}>🔝</span>}
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              currentZPosition === 'front'
                ? 'bg-amber-50 text-amber-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => handleSetZPosition('front')}
          >
            Di depan teks {currentZPosition === 'front' && '✓'}
          </MenuItem>
        </>
      )}

      {!isFreeMove && !imageAttrs.wrap && (
        <>
          <div className='px-3 pt-1.5 pb-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Alignment</div>
          <MenuItem
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              imageAttrs.align === 'left'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => {
              editor.commands.setNodeSelection(nodePos)
              editor.commands.setImageAlign('left')
              onClose()
            }}
          >
            Align Left {imageAttrs.align === 'left' && '✓'}
          </MenuItem>
          <MenuItem
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              imageAttrs.align === 'center'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => {
              editor.commands.setNodeSelection(nodePos)
              editor.commands.setImageAlign('center')
              onClose()
            }}
          >
            Align Center {imageAttrs.align === 'center' && '✓'}
          </MenuItem>
          <MenuItem
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              imageAttrs.align === 'right'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => {
              editor.commands.setNodeSelection(nodePos)
              editor.commands.setImageAlign('right')
              onClose()
            }}
          >
            Align Right {imageAttrs.align === 'right' && '✓'}
          </MenuItem>
        </>
      )}

      {!isFreeMove && (
        <>
          <div className='h-px bg-slate-100 my-1' />
          <div className='px-3 pt-1.5 pb-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Wrap Text</div>
          <MenuItem
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              !imageAttrs.wrap
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => {
              editor.commands.setNodeSelection(nodePos)
              editor.commands.setImageWrap(null)
              onClose()
            }}
          >
            No Wrap {!imageAttrs.wrap && '✓'}
          </MenuItem>
          <MenuItem
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              imageAttrs.wrap === 'left'
                ? 'bg-green-50 text-green-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => {
              editor.commands.setNodeSelection(nodePos)
              editor.commands.setImageWrap('left')
              onClose()
            }}
          >
            Wrap Left {imageAttrs.wrap === 'left' && '✓'}
          </MenuItem>
          <MenuItem
            className={twMerge(
              'rounded-none px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
              imageAttrs.wrap === 'right'
                ? 'bg-green-50 text-green-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
            onClick={() => {
              editor.commands.setNodeSelection(nodePos)
              editor.commands.setImageWrap('right')
              onClose()
            }}
          >
            Wrap Right {imageAttrs.wrap === 'right' && '✓'}
          </MenuItem>
        </>
      )}
      <div className='h-px bg-slate-100 my-1' />

      <MenuItem
        iconStart={currentMode === 'inline' ? <IconLock fontSize={15} /> : <IconUnlock fontSize={15} />}
        className='rounded-none px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        onClick={handleToggleMode}
      >
        {currentMode === 'inline' ? 'Enable Free Move' : 'Disable Free Move'}
      </MenuItem>

      <div className='h-px bg-slate-100 my-1' />

      <MenuItem
        iconStart={<IconRefresh fontSize={15} className='text-slate-500' />}
        className='rounded-none px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        onClick={handleReplaceImage}
      >
        Replace Image
      </MenuItem>
      <MenuItem
        iconStart={<IconDelete fontSize={15} className='text-red-500' />}
        className='rounded-none px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700'
        onClick={handleDeleteImage}
      >
        Delete Image
      </MenuItem>
    </Card>
  )
}
