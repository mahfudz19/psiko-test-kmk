import { Editor } from '@tiptap/react'
import { ItemButton } from '.'

// Icon Components
const IndentIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <polyline points='3 8 7 12 3 16' />
    <line x1='21' x2='11' y1='12' y2='12' />
    <line x1='21' x2='11' y1='6' y2='6' />
    <line x1='21' x2='11' y1='18' y2='18' />
  </svg>
)

const OutdentIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <polyline points='7 8 3 12 7 16' />
    <line x1='21' x2='11' y1='12' y2='12' />
    <line x1='21' x2='11' y1='6' y2='6' />
    <line x1='21' x2='11' y1='18' y2='18' />
  </svg>
)

function IndentControls({ editor }: { editor: Editor }) {
  const canIndent = editor.can().indent()
  const canOutdent = editor.can().outdent()

  return (
    <>
      <ItemButton
        onMouseDown={e => e.preventDefault()}
        onClick={() => editor.commands.outdent()}
        disabled={!canOutdent}
        title='Decrease Indent (Shift+Tab)'
        className={!canOutdent ? 'opacity-50 cursor-not-allowed' : ''}
      >
        <OutdentIcon />
      </ItemButton>
      <ItemButton
        onMouseDown={e => e.preventDefault()}
        onClick={() => editor.commands.indent()}
        disabled={!canIndent}
        title='Increase Indent (Tab)'
        className={!canIndent ? 'opacity-50 cursor-not-allowed' : ''}
      >
        <IndentIcon />
      </ItemButton>
    </>
  )
}

export default IndentControls
