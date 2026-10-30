'use client'
import { findParentNode } from '@tiptap/core'
import { Level } from '@tiptap/extension-heading'
import { EditorContent, Editor as EditorTitap } from '@tiptap/react'
import { TextSelection } from 'prosemirror-state'
import { JSX, useEffect, useRef, useState } from 'react'
import Ripple from '@/components/ui/Ripple'
import { twMerge } from 'tailwind-merge'
import Formatting from './Heading'
import FontSizeDropdown from './FontSizeDropdown'
import LineSpacingDropdown from './LineSpacingDropdown'
import OrderedListDropdown from './OrderedListDropdown'
import StyleCell from './Table/StyleCell'
import StyleTable from './Table/StyleTable'
import TableContextMenu from './Table/TableContextMenu'
import TableGrid from './Table/TableGrid'
import { useColumnResize } from './Table/useColumnResize'
import TextAlignDropdown from './TextAlignDropdown'
import UnorderedListDropdown from './UnorderedListDropdown'
import { BoldIcon, ClearIcon, ItalicIcon, LinkIcon, UnderlineIcon, UnlinkIcon, IconImage } from './icon'
import { CustomAction, CustomContextMenuItem } from '..'
import IndentControls from './IndentControls'
import CustomContextMenu from './CustomContextMenu'
import ImageContextMenu from './Image/ImageContextMenu'
import FontFamilyDropdown from './FontFamilyDropdown'

export const ItemButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    noCenterRipple?: boolean
    active?: boolean
    subItem?: boolean
    dropdown?: boolean
  }
) => {
  const { children, active, subItem, dropdown, className, noCenterRipple, ...rest } = props
  return (
    <button
      type='button'
      className={twMerge(
        'rounded-lg text-slate-700 transition-colors',
        subItem
          ? 'block w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md'
          : 'relative flex items-center justify-center gap-1 min-w-[2rem] h-8 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 hover:text-slate-900',
        active ? 'bg-blue-100 text-blue-700 font-bold border border-blue-200 shadow-2xs' : '',
        className
      )}
      {...rest}
    >
      <Ripple color='primary' centerRipple={noCenterRipple ? false : !subItem} />
      {children}
      {dropdown && <span className='text-[10px] text-slate-400 ml-0.5'>▾</span>}
    </button>
  )
}

export default function EditorWithFloatingToolbar(props: {
  editor: EditorTitap
  customActions?: CustomAction[]
  customContextMenuItems?: CustomContextMenuItem[]
  children: (onClick: () => void, label: React.ReactNode, active?: boolean) => JSX.Element
}) {
  const { editor, customActions, customContextMenuItems, children: btn } = props
  const [_, setTick] = useState(0)
  const [contextMenu, setContextMenu] = useState<{
    top: number
    left: number
    type: 'table' | 'image'
    pos: number
  } | null>(null)
  const [customContextMenu, setCustomContextMenu] = useState<{ top: number; left: number } | null>(null)

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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
      editor.commands.insertImage({ src: base64, alt: file.name, title: file.name })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  useColumnResize(editor)

  const [isStyleCellOpen, setIsStyleCellOpen] = useState(false)
  const [isStyleTableOpen, setIsStyleTableOpen] = useState(false)

  useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setContextMenu(null)
        setCustomContextMenu(null)
        return
      }

      if (
        e.shiftKey &&
        customContextMenuItems &&
        customContextMenuItems.length > 0 &&
        (editor.isFocused || !editor.state.selection.empty)
      ) {
        e.preventDefault()
        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        const top = e.clientY - wrapperRect.top
        const left = e.clientX - wrapperRect.left
        setCustomContextMenu({ top, left })
        setContextMenu(null)
        return
      }

      setCustomContextMenu(null)

      const domTarget = e.target as HTMLElement

      const imageWrapper =
        domTarget.closest('.image-node-wrapper') ||
        domTarget.closest('.image-node-wrapper-container')?.querySelector('.image-node-wrapper')

      if (imageWrapper) {
        e.preventDefault()

        let imagePos = -1
        try {
          const pos = editor.view.posAtDOM(imageWrapper as Node, 0)
          if (pos !== null && pos !== undefined) {
            imagePos = pos
          }
        } catch {
          try {
            const container = domTarget.closest('.image-node-wrapper-container')
            if (container) {
              imagePos = editor.view.posAtDOM(container as Node, 0)
            }
          } catch {
            imagePos = -1
          }
        }

        setContextMenu({
          top: e.clientY,
          left: e.clientX,
          type: 'image',
          pos: imagePos
        })
        return
      }

      const pos = editor.view.posAtDOM(domTarget, 0)
      if (pos === null || pos === undefined) return

      const tmpSelection = TextSelection?.create?.(editor.state.doc, pos)
      const tableInfo = findParentNode(node => node.type.name === 'table')(tmpSelection)

      if (tableInfo) {
        e.preventDefault()
        setContextMenu({ top: e.clientY, left: e.clientX, type: 'table', pos: tableInfo.pos })
      } else {
        setContextMenu(null)
      }
    }

    document.addEventListener('contextmenu', handleGlobalContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleGlobalContextMenu)
    }
  }, [editor, customContextMenuItems])

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 2) {
      const domTarget = event.target as HTMLElement
      if (editor.view.dom.contains(domTarget)) event.preventDefault()
    }
  }

  const actions = {
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    underline: () => editor.chain().focus().toggleUnderline().run(),
    strike: () => editor.chain().focus().toggleStrike().run(),
    code: () => editor.chain().focus().toggleCode().run(),
    setParagraph: () => editor.chain().focus().setParagraph().run(),
    toggleHeading: (level: Level) => editor.chain().focus().toggleHeading({ level }).run(),
    codeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
    blockquote: () => editor.chain().focus().toggleBlockquote().run(),

    bulletDisc: () =>
      editor.chain().focus().toggleBulletList().updateAttributes('bulletList', { listType: 'disc' }).run(),
    bulletCircle: () =>
      editor.chain().focus().toggleBulletList().updateAttributes('bulletList', { listType: 'circle' }).run(),
    bulletSquare: () =>
      editor.chain().focus().toggleBulletList().updateAttributes('bulletList', { listType: 'square' }).run(),
    ordered: () => editor.chain().focus().toggleOrderedList().run(),

    alignLeft: () => editor.chain().focus().setTextAlign('left').run(),
    alignCenter: () => editor.chain().focus().setTextAlign('center').run(),
    alignRight: () => editor.chain().focus().setTextAlign('right').run(),
    link: () => {
      const url = window.prompt('Masukkan URL')
      if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    },
    unlink: () => editor.chain().focus().unsetLink().run(),
    clear: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    insertTable: (rows: number, cols: number) => editor.chain().focus().insertTable({ rows, cols }).run()
  }

  return (
    <div
      className={twMerge('w-full flex flex-col bg-white')}
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={toolbarRef}
        className='w-full border-b border-slate-200 bg-slate-50/95 p-2 flex items-center flex-wrap gap-1 rounded-t-2xl select-none sticky top-0 z-20'
        onMouseDown={e => {
          if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault()
        }}
      >
        <div
          className='flex items-center flex-wrap gap-1 w-full'
          onClick={() => setTick(t => t + 1)}
        >
          <Formatting editor={editor} />
          <FontFamilyDropdown editor={editor} />
          <FontSizeDropdown editor={editor} />
          <div className='h-5 w-px bg-slate-300 mx-1' />
          {btn(actions.bold, <BoldIcon className='w-4 h-4' />, editor.isActive('bold'))}
          {btn(actions.italic, <ItalicIcon className='w-4 h-4' />, editor.isActive('italic'))}
          {btn(actions.underline, <UnderlineIcon className='w-4 h-4' />, editor.isActive('underline'))}
          <div className='h-5 w-px bg-slate-300 mx-1' />
          <TextAlignDropdown editor={editor} />
          <LineSpacingDropdown editor={editor} />
          <div className='h-5 w-px bg-slate-300 mx-1' />
          <IndentControls editor={editor} />
          <div className='h-5 w-px bg-slate-300 mx-1' />
          <UnorderedListDropdown editor={editor} />
          <OrderedListDropdown editor={editor} />
          <div className='h-5 w-px bg-slate-300 mx-1' />
          <TableGrid editor={editor} />
          {btn(() => fileInputRef.current?.click(), <IconImage className='w-4.5 h-4.5 text-slate-700' />)}
          <div className='h-5 w-px bg-slate-300 mx-1' />
          {btn(actions.link, <LinkIcon className='w-4 h-4' />, editor.isActive('link'))}
          {btn(actions.unlink, <UnlinkIcon className='w-4 h-4' />)}
          {btn(actions.clear, <ClearIcon className='w-4 h-4' />)}
          {customActions && customActions.length > 0 && (
            <>
              <div className='h-5 w-px bg-slate-300 mx-1' />
              {customActions.map(action => (
                <ItemButton
                  key={action.id}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => action.onClick(editor)}
                  className={action.color ? `text-${action.color}-main hover:bg-${action.color}-main/10` : ''}
                  title={action.label}
                >
                  {action.icon}
                </ItemButton>
              ))}
            </>
          )}
        </div>
      </div>
      <input ref={fileInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={handleImageUpload} />
      <EditorContent editor={editor} />

      {/* Table Context Menu */}
      {contextMenu?.type === 'table' && (
        <TableContextMenu
          editor={editor}
          top={contextMenu.top}
          left={contextMenu.left}
          onClose={() => setContextMenu(null)}
          dialogStyleCell={() => {
            setIsStyleCellOpen(true)
            setContextMenu(null)
          }}
          dialogStyleTable={() => {
            setIsStyleTableOpen(true)
            setContextMenu(null)
          }}
        />
      )}

      {/* 🔥 NEW: Image Context Menu */}
      {contextMenu?.type === 'image' && (
        <ImageContextMenu
          editor={editor}
          top={contextMenu.top}
          left={contextMenu.left}
          nodePos={contextMenu.pos}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Custom Context Menu */}
      {customContextMenu && customContextMenuItems && (
        <CustomContextMenu
          editor={editor}
          top={customContextMenu.top}
          left={customContextMenu.left}
          items={customContextMenuItems}
          onClose={() => setCustomContextMenu(null)}
        />
      )}

      {/* Render komponen dialog */}
      <StyleCell open={isStyleCellOpen} setOpen={setIsStyleCellOpen} editor={editor} />
      <StyleTable open={isStyleTableOpen} setOpen={setIsStyleTableOpen} editor={editor} />
    </div>
  )
}
