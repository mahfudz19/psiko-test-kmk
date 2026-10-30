import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ItemButton } from '.'

const OrderList: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='18' className='inline' height='18' viewBox='0 0 24 24' {...props}>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M10 4h10a1 1 0 0 1 0 2H10a1 1 0 1 1 0-2m0 7h10a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2m0 7h10a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2M4.5 4a.5.5 0 0 1 0-1h1c.28 0 .5.22.5.5v3a.5.5 0 0 1-1 0V4.015zm0 6h2c.28 0 .5.22.5.5v.5l-1.7 2h1.2c.28 0 .5.22.5.5s-.224.5-.5.5h-2c-.28 0-.5-.22-.5-.5V13l1.7-2H4.5c-.28 0-.5-.22-.5-.5s.199-.5.5-.5m2 11h-2a.5.5 0 1 1 0-1H6v-.5H4.5a.5.5 0 1 1 0-1H6V18H4.5a.5.5 0 1 1 0-1h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5'
    />
  </svg>
)

function OrderedListDropdown({ editor }: { editor: Editor }) {
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

  const applyOrdered = async (style: string | null, start?: number) => {
    const isActive = editor.isActive('orderedList')
    const current = isActive ? editor.getAttributes('orderedList') : {}
    const currentStyle = (current?.orderStyle as string) || 'decimal'
    const currentStart = Number(current?.orderStart ?? 1)

    if (isActive && style === currentStyle && (start === undefined || start === currentStart)) {
      editor.chain().focus().toggleOrderedList().run()
      setOpen(false)
      return
    }

    if (isActive) {
      const attrs: Record<string, any> = {}
      if (style) attrs.orderStyle = style
      if (typeof start === 'number' && !isNaN(start)) attrs.orderStart = start
      editor.chain().focus().updateAttributes('orderedList', attrs).run()
      setOpen(false)
      return
    }

    editor.chain().focus().toggleOrderedList().run()
    if (style || typeof start === 'number') {
      await new Promise(resolve => setTimeout(resolve, 10))
      const attrs: Record<string, any> = {}
      if (style) attrs.orderStyle = style
      if (typeof start === 'number' && !isNaN(start)) attrs.orderStart = start
      editor.chain().focus().updateAttributes('orderedList', attrs).run()
    }
    setOpen(false)
  }

  const currentAttrs = editor.isActive('orderedList') ? editor.getAttributes('orderedList') : {}

  return (
    <div ref={ref} className='relative'>
      <ItemButton
        dropdown
        active={editor.isActive('orderedList')}
        onMouseDown={e => e.preventDefault()}
        onClick={() => setOpen(s => !s)}
        aria-haspopup='true'
        aria-expanded={open}
        title='Ordered list styles'
      >
        <OrderList />
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
          active={currentAttrs?.orderStyle === 'decimal'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyOrdered('decimal')}
          title='Decimal (1, 2, 3)'
        >
          <svg width='36' height='36' viewBox='0 0 48 48' focusable='false'>
            <g fillRule='evenodd'>
              <path opacity='.3' d='M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z'></path>
              <path d='M10 17v-4.8l-1.5 1v-1.1l1.6-1h1.2V17h-1.2Zm3.6.1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7Zm-5 5.7c0-1.2.8-2 2.1-2s2.1.8 2.1 1.8c0 .7-.3 1.2-1.4 2.2l-1.1 1v.2h2.6v1H8.6v-.9l2-1.9c.8-.8 1-1.1 1-1.5 0-.5-.4-.8-1-.8-.5 0-.9.3-.9.9H8.5Zm6.3 4.3c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7ZM10 34.4v-1h.7c.6 0 1-.3 1-.8 0-.4-.4-.7-1-.7s-1 .3-1 .8H8.6c0-1.1 1-1.8 2.2-1.8 1.3 0 2.1.6 2.1 1.6 0 .7-.4 1.2-1 1.3v.1c.8.1 1.3.7 1.3 1.4 0 1-1 1.9-2.4 1.9-1.3 0-2.2-.8-2.3-2h1.2c0 .6.5 1 1.1 1 .7 0 1-.4 1-1 0-.5-.3-.8-1-.8h-.7Zm4.7 2.7c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .8.3.8.7 0 .4-.3.7-.8.7Z'></path>
            </g>
          </svg>
        </ItemButton>
        <ItemButton
          subItem
          className='w-10 h-10 p-0 flex items-center justify-center rounded-lg hover:bg-slate-100'
          active={currentAttrs?.orderStyle === 'lower-alpha'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyOrdered('lower-alpha')}
          title='Lower alpha (a, b, c)'
        >
          <svg width='36' height='36' viewBox='0 0 48 48' focusable='false'>
            <g fillRule='evenodd'>
              <path opacity='.3' d='M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z'></path>
              <path d='M10.3 15.2c.5 0 1-.4 1-.9V14h-1c-.5.1-.8.3-.8.6 0 .4.3.6.8.6Zm-.4.9c-1 0-1.5-.6-1.5-1.4 0-.8.6-1.3 1.7-1.4h1.1v-.4c0-.4-.2-.6-.7-.6-.5 0-.8.1-.9.4h-1c0-.8.8-1.4 2-1.4 1.1 0 1.8.6 1.8 1.6V16h-1.1v-.6h-.1c-.2.4-.7.7-1.3.7Zm4.6 0c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Zm-3.2 10c-.6 0-1.2-.3-1.4-.8v.7H8.5v-6.3H10v2.5c.3-.5.8-.9 1.4-.9 1.2 0 1.9 1 1.9 2.4 0 1.5-.7 2.4-1.9 2.4Zm-.4-3.7c-.7 0-1 .5-1 1.3s.3 1.4 1 1.4c.6 0 1-.6 1-1.4 0-.8-.4-1.3-1-1.3Zm4 3.7c-.5 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Zm-2.2 7h-1.2c0-.5-.4-.8-.9-.8-.6 0-1 .5-1 1.4 0 1 .4 1.4 1 1.4.5 0 .8-.2 1-.7h1c0 1-.8 1.7-2 1.7-1.4 0-2.2-.9-2.2-2.4s.8-2.4 2.2-2.4c1.2 0 2 .7 2 1.7Zm1.8 3c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Z'></path>
            </g>
          </svg>
        </ItemButton>
        <ItemButton
          subItem
          className='w-10 h-10 p-0 flex items-center justify-center rounded-lg hover:bg-slate-100'
          active={currentAttrs?.orderStyle === 'upper-alpha'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyOrdered('upper-alpha')}
          title='Upper alpha (A, B, C)'
        >
          <svg width='36' height='36' viewBox='0 0 48 48' focusable='false'>
            <g fillRule='evenodd'>
              <path opacity='.3' d='M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z'></path>
              <path d='m12.6 17-.5-1.4h-2L9.5 17H8.3l2-6H12l2 6h-1.3ZM11 12.3l-.7 2.3h1.6l-.8-2.3Zm4.7 4.8c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7ZM11.4 27H8.7v-6h2.6c1.2 0 1.9.6 1.9 1.5 0 .6-.5 1.2-1 1.3.7.1 1.3.7 1.3 1.5 0 1-.8 1.7-2 1.7ZM10 22v1.5h1c.6 0 1-.3 1-.8 0-.4-.4-.7-1-.7h-1Zm0 4H11c.7 0 1.1-.3 1.1-.8 0-.6-.4-.9-1.1-.9H10V26Zm5.4 1.1c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Zm-4.1 10c-1.8 0-2.8-1.1-2.8-3.1s1-3.1 2.8-3.1c1.4 0 2.5.9 2.6 2.2h-1.3c0-.7-.6-1.1-1.3-1.1-1 0-1.6.7-1.6 2s.6 2 1.6 2c.7 0 1.2-.4 1.4-1h1.2c-.1 1.3-1.2 2.2-2.6 2.2Zm4.5 0c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7Z'></path>
            </g>
          </svg>
        </ItemButton>
        <ItemButton
          subItem
          className='w-10 h-10 p-0 flex items-center justify-center rounded-lg hover:bg-slate-100'
          active={currentAttrs?.orderStyle === 'lower-roman'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyOrdered('lower-roman')}
          title='Lower roman (i, ii, iii)'
        >
          <svg width='36' height='36' viewBox='0 0 48 48' focusable='false'>
            <g fillRule='evenodd'>
              <path opacity='.3' d='M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z'></path>
              <path d='M15.1 16v-1.2h1.3V16H15Zm0 10v-1.2h1.3V26H15Zm0 10v-1.2h1.3V36H15Z'></path>
              <path
                fillRule='nonzero'
                d='M12 21h1.5v5H12zM12 31h1.5v5H12zM9 21h1.5v5H9zM9 31h1.5v5H9zM6 31h1.5v5H6zM12 11h1.5v5H12zM12 19h1.5v1H12zM12 29h1.5v1H12zM9 19h1.5v1H9zM9 29h1.5v1H9zM6 29h1.5v1H6zM12 9h1.5v1H12z'
              ></path>
            </g>
          </svg>
        </ItemButton>
        <ItemButton
          subItem
          className='w-10 h-10 p-0 flex items-center justify-center rounded-lg hover:bg-slate-100'
          active={currentAttrs?.orderStyle === 'upper-roman'}
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyOrdered('upper-roman')}
          title='Upper roman (I, II, III)'
        >
          <svg width='36' height='36' viewBox='0 0 48 48' focusable='false'>
            <g fillRule='evenodd'>
              <path opacity='.3' d='M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z'></path>
              <path d='M15.1 17v-1.2h1.3V17H15Zm0 10v-1.2h1.3V27H15Zm0 10v-1.2h1.3V37H15Z'></path>
              <path
                fillRule='nonzero'
                d='M12 20h1.5v7H12zM12 30h1.5v7H12zM9 20h1.5v7H9zM9 30h1.5v7H9zM6 30h1.5v7H6zM12 10h1.5v7H12z'
              ></path>
            </g>
          </svg>
        </ItemButton>
      </div>
    </div>
  )
}

export default OrderedListDropdown
