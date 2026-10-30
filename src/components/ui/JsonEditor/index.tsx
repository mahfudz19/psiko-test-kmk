import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import IconArrowDropDownRounded from '../Icon/IconArrowDropDownRounded'
import IconClose from '../Icon/IconClose'
import IconRedo from '../Icon/IconRedo'
import IconSearch from '../Icon/IconSearch'
import IconUndo from '../Icon/IconUndo'
import IconButton from '../IconButton'
import Input from '../Input'
import { DebounceCallback } from '@/components/utility/UI/DebounceUI'

const autoClosePairs: Record<string, string> = { '{': '}', '[': ']', '"': '"', "'": "'", '(': ')', '`': '`', '<': '>' }

interface JsonEditorChangeEvent<T> {
  target: { name?: string; value: T | undefined }
}

interface JsonEditorProps<T> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: T | undefined
  onChange?: (e: JsonEditorChangeEvent<T>) => void
}

const LineCount = ({ internalValue }: { internalValue: string }) => {
  const [lineCount, setLineCount] = useState(1)
  useEffect(() => setLineCount(internalValue?.split?.('\n')?.length), [internalValue])

  return (
    <div className='bg-secondary-light/25 select-none text-right py-2'>
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i} className='text-gray-400 text-xs px-2 py-0.5 text-right'>
          {i + 1}
        </div>
      ))}
    </div>
  )
}

interface SearchProps {
  setShowFind: Dispatch<SetStateAction<boolean>>
  scrollableRef: RefObject<HTMLDivElement | null>
  internalValue: string
  textareaRef: RefObject<HTMLTextAreaElement | null>
  findInputRef: RefObject<HTMLInputElement | null>
}
const Search = (props: SearchProps) => {
  const { setShowFind, internalValue, scrollableRef, textareaRef, findInputRef } = props
  const [matches, setMatches] = useState<{ index: number; pos: number }[]>([])
  const [search, setSearch] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)

  // Scroll to match function
  const scrollToMatch = useCallback(
    (matchIndex: number, matches: { index: number; pos: number }[], searchText: string) => {
      if (matchIndex < 0 || matchIndex >= matches.length || !textareaRef.current || !scrollableRef.current) return

      const match = matches[matchIndex]
      const textarea = textareaRef.current
      const scrollable = scrollableRef.current

      requestAnimationFrame(() => {
        // Set selection and focus
        textarea.focus()
        textarea.setSelectionRange(match.pos, match.pos + searchText.length)

        // Calculate scroll position
        const lineHeight = 20
        const linesBefore = internalValue.substring(0, match.pos).split('\n').length - 1
        const targetOffset = linesBefore * lineHeight
        const totalMatchHeight = scrollable.clientHeight
        const scrollTarget = targetOffset - totalMatchHeight / 2 + lineHeight

        // Perform scroll
        scrollable.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' })
      })
    },
    [internalValue, textareaRef, scrollableRef] // Hanya dependensi yang benar-benar diperlukan
  )

  // Debounced search function
  const performSearch = useCallback(
    (text: string, content: string) => {
      if (!text) {
        setMatches([])
        setCurrentMatchIndex(-1)
        return
      }

      const searchStr = text
      const newMatches: { index: number; pos: number }[] = []
      let pos = -1

      // Simple case-insensitive search
      const lowerText = content.toLowerCase()
      const lowerSearch = searchStr.toLowerCase()

      while ((pos = lowerText.indexOf(lowerSearch, pos + 1)) !== -1) {
        if (pos === -1) break
        newMatches.push({ index: newMatches.length, pos })
      }

      setMatches(newMatches)
      const newIndex = newMatches.length > 0 ? 0 : -1
      setCurrentMatchIndex(newIndex)

      // Panggil scrollToMatch dengan parameter langsung
      if (newIndex >= 0) scrollToMatch(newIndex, newMatches, text)
    },
    [scrollToMatch]
  )

  const handleFindChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    performSearch(value, internalValue)
  }

  const handleFindKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) goToPreviousMatch()
      else goToNextMatch()
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      setShowFind(false)
    }
  }

  const goToNextMatch = () => {
    if (matches.length === 0) return
    const newIndex = (currentMatchIndex + 1) % matches.length
    setCurrentMatchIndex(newIndex)
    scrollToMatch(newIndex, matches, search)
  }

  const goToPreviousMatch = () => {
    if (matches.length === 0) return
    const newIndex = (currentMatchIndex - 1 + matches.length) % matches.length
    setCurrentMatchIndex(newIndex)
    scrollToMatch(newIndex, matches, search)
  }

  const onSearch = DebounceCallback((e: any) => handleFindChange(e))

  return (
    <div className='flex items-center bg-white border border-divider rounded-md shadow-sm p-1'>
      <Input
        ref={findInputRef}
        variant='underlined'
        sizes='small'
        value={search}
        onChange={e => {
          onSearch(e)
          setSearch(e.target.value)
        }}
        onKeyDown={handleFindKeyDown}
        placeholder='Find...'
        startAdornment={
          <div>
            <IconSearch fontSize={16} />
          </div>
        }
        endAdornment={
          <div className='text-xs text-gray-500 px-1'>
            {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : '0/0'}
          </div>
        }
      />
      <div className='border-l ml-1 border-divider flex'>
        <IconButton
          type='button'
          variant='text'
          sizes='small'
          onClick={goToPreviousMatch}
          disabled={matches.length === 0}
          className='p-0'
          color='secondary'
        >
          <IconArrowDropDownRounded fontSize={28} className='rotate-180' />
        </IconButton>
        <IconButton
          type='button'
          variant='text'
          sizes='small'
          onClick={goToNextMatch}
          disabled={matches.length === 0}
          className='p-0'
          color='secondary'
        >
          <IconArrowDropDownRounded fontSize={28} />
        </IconButton>
        <IconButton
          type='button'
          variant='text'
          sizes='small'
          color='error'
          onClick={() => {
            setShowFind(false)
            setMatches([])
            setSearch('')
          }}
        >
          <IconClose fontSize={16} />
        </IconButton>
      </div>
    </div>
  )
}

interface UndoRedoProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  cursorPosition: number
  internalValue: string
  lastChangeWasUndoRedo: RefObject<boolean>
  currentIndexRef: RefObject<number>
  historyRef: RefObject<{ value: string; cursorPos: number }[]>
  handleUndo: () => void
  handleRedo: () => void
}
const UndoRedo = (props: UndoRedoProps) => {
  const {
    textareaRef,
    cursorPosition,
    lastChangeWasUndoRedo,
    internalValue,
    currentIndexRef,
    historyRef,
    handleRedo,
    handleUndo
  } = props

  useEffect(() => {
    if (
      textareaRef.current &&
      (lastChangeWasUndoRedo.current || cursorPosition !== textareaRef.current.selectionStart)
    ) {
      textareaRef.current.selectionStart = cursorPosition
      textareaRef.current.selectionEnd = cursorPosition
      lastChangeWasUndoRedo.current = false
    }
  }, [internalValue, cursorPosition, lastChangeWasUndoRedo, textareaRef])

  return (
    <>
      <IconButton
        type='button'
        variant='text'
        onClick={handleUndo}
        disabled={currentIndexRef.current <= 0 || historyRef.current.length <= 1}
      >
        <IconUndo />
      </IconButton>
      <IconButton
        type='button'
        variant='text'
        onClick={handleRedo}
        disabled={currentIndexRef.current >= historyRef.current.length - 1}
      >
        <IconRedo />
      </IconButton>
    </>
  )
}

function JsonEditor<T>({ value, onChange, className, ...rest }: JsonEditorProps<T>) {
  const [parseError, setParseError] = useState<string | null>(null)
  const [internalValue, setInternalValue] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showFind, setShowFind] = useState(false)

  const lastChangeWasUndoRedo = useRef(false)
  const historyRef = useRef<{ value: string; cursorPos: number }[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const currentIndexRef = useRef(-1)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const findInputRef = useRef<HTMLInputElement>(null)

  // Inisialisasi nilai awal
  useEffect(() => {
    const initialValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    setInternalValue(initialValue)

    // Tambahkan initial value ke history
    historyRef.current = [{ value: initialValue, cursorPos: 0 }]
    currentIndexRef.current = 0

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update ketika value prop berubah dari luar
  useEffect(() => {
    if (textareaRef.current !== document.activeElement) {
      const newValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
      setInternalValue(newValue)
      setParseError(null)

      // Tambahkan ke history jika berbeda dengan state terakhir
      if (historyRef.current[currentIndexRef.current]?.value !== newValue) {
        saveToHistory(newValue, 0)
      }
    }
  }, [value])

  const saveToHistory = (value: string, cursorPos?: number) => {
    // Skip jika value sama dengan state terakhir
    if (historyRef.current[currentIndexRef.current]?.value === value) {
      return
    }

    // Potong history jika ada redo yang belum dijalankan
    if (currentIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1)
    }

    historyRef.current.push({
      value,
      cursorPos: cursorPos ?? textareaRef.current?.selectionStart ?? 0
    })
    currentIndexRef.current = historyRef.current.length - 1
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const { value, selectionStart, selectionEnd } = textarea

    // Handle Command+F/Ctrl+F
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault()
      setShowFind(true)
      setTimeout(() => {
        findInputRef.current?.focus()
        findInputRef.current?.select()
      }, 300)

      return
    }

    // Handle Enter key between auto-close pairs
    if (e.key === 'Enter') {
      e.preventDefault() // Selalu prevent default untuk kontrol penuh

      const beforeCursor = value.substring(0, selectionStart)
      const afterCursor = value.substring(selectionEnd)

      // 1. Cek apakah di antara pasangan karakter (seperti sebelumnya)
      for (const [open, close] of Object.entries(autoClosePairs)) {
        if (beforeCursor.endsWith(open) && afterCursor.startsWith(close)) {
          // Hitung indentasi sebelumnya
          const lineStart = beforeCursor.lastIndexOf('\n') + 1
          const currentLine = beforeCursor.substring(lineStart)
          const baseIndent = currentLine.match(/^\s*/)?.[0] || ''

          const newValue =
            beforeCursor +
            '\n' +
            baseIndent +
            '    ' + // Indentasi tambahan
            '\n' +
            baseIndent + // Indentasi dasar
            afterCursor

          setInternalValue(newValue)
          const newCursorPos = selectionStart + 1 + baseIndent.length + 4
          setCursorPosition(newCursorPos)
          saveToHistory(newValue, newCursorPos)
          return
        }
      }

      // 2. Kasus normal: pertahankan indentasi line sebelumnya
      const lineStart = beforeCursor.lastIndexOf('\n') + 1
      const currentLine = beforeCursor.substring(lineStart)
      const baseIndent = currentLine.match(/^\s*/)?.[0] || ''

      // Cek apakah line berakhir dengan buka kurung atau karakter tertentu yang butuh indentasi tambahan
      const shouldAddIndent = /[\{\[\(]\s*$/.test(beforeCursor)

      // Cek apakah line setelah cursor adalah close bracket
      const nextLine = afterCursor.split('\n')[0]
      const shouldOutdent = /^\s*[\}\]\)]/.test(nextLine)

      let newValue, newCursorPos

      if (shouldAddIndent) {
        // Kasus: line berakhir dengan {, [, atau (
        newValue = beforeCursor + '\n' + baseIndent + '    ' + afterCursor
        newCursorPos = selectionStart + 1 + baseIndent.length + 4
      } else if (shouldOutdent) {
        // Kasus: line berikutnya mulai dengan }, ], atau )
        const outdent = baseIndent.length >= 4 ? baseIndent.slice(0, -4) : ''
        newValue = beforeCursor + '\n' + outdent + afterCursor
        newCursorPos = selectionStart + 1 + outdent.length
      } else {
        // Kasus normal: pertahankan indentasi
        newValue = beforeCursor + '\n' + baseIndent + afterCursor
        newCursorPos = selectionStart + 1 + baseIndent.length
      }

      setInternalValue(newValue)
      setCursorPosition(newCursorPos)
      saveToHistory(newValue, newCursorPos)
    }
    if (showFind && e.key === 'Escape') {
      e.stopPropagation()
      setShowFind(false)
    }
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault()
      const beforeCursor = value.substring(0, selectionStart)
      const afterCursor = value.substring(selectionEnd)

      // Jika ada teks yang diseleksi
      if (selectionStart !== selectionEnd) {
        const selectedText = value.substring(selectionStart, selectionEnd)
        const lines = selectedText.split('\n')

        if (e.shiftKey) {
          // Shift+Tab: Unindent
          const unindentedLines = lines.map(line => {
            // Hapus maksimal 4 spasi atau 1 tab
            if (line.startsWith('    ')) return line.substring(4)
            if (line.startsWith('\t')) return line.substring(1)
            return line
          })
          const newValue = beforeCursor + unindentedLines.join('\n') + afterCursor

          setInternalValue(newValue)
          setCursorPosition(Math.max(selectionStart - 4, 0))
          saveToHistory(newValue, Math.max(selectionStart - 4, 0))
        } else {
          // Tab: Indent
          const indentedLines = lines.map(line => '    ' + line).join('\n')
          const newValue = beforeCursor + indentedLines + afterCursor

          setInternalValue(newValue)
          setCursorPosition(selectionStart + 4)
          saveToHistory(newValue, selectionStart + 4)
        }
      }
      // Jika tidak ada seleksi
      else {
        if (e.shiftKey) {
          // Shift+Tab: Unindent jika ada spasi/tab sebelum kursor
          const lineStart = beforeCursor.lastIndexOf('\n') + 1
          const currentLine = beforeCursor.substring(lineStart)
          const indentMatch = currentLine.match(/^[ \t]+/)

          if (indentMatch && indentMatch[0].length > 0) {
            const indent = indentMatch[0]
            const unindentAmount = indent.startsWith('    ') ? 4 : 1
            const newBeforeCursor = beforeCursor.substring(0, beforeCursor.length - unindentAmount)
            const newValue = newBeforeCursor + afterCursor

            setInternalValue(newValue)
            setCursorPosition(selectionStart - unindentAmount)
            saveToHistory(newValue, selectionStart - unindentAmount)
          }
        } else {
          // Tab: Indent
          const newValue = beforeCursor + '    ' + afterCursor

          setInternalValue(newValue)
          setCursorPosition(selectionStart + 4)
          saveToHistory(newValue, selectionStart + 4)
        }
      }
      return
    }

    // Undo: Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      handleUndo()
    }
    // Redo: Ctrl+Shift+Z atau Ctrl+Y
    else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      handleRedo()
    }
    // Handle auto-closing pairs
    else if (Object.keys(autoClosePairs).includes(e.key)) {
      e.preventDefault()

      const closingChar = autoClosePairs[e.key]
      const beforeCursor = value.substring(0, selectionStart)
      const afterCursor = value.substring(selectionEnd)

      // Jika ada teks yang diseleksi
      if (selectionStart !== selectionEnd) {
        const selectedText = value.substring(selectionStart, selectionEnd)
        const newValue = `${beforeCursor}${e.key}${selectedText}${closingChar}${afterCursor}`

        setInternalValue(newValue)
        setCursorPosition(selectionStart + 1 + selectedText.length + 1)
        saveToHistory(newValue, selectionStart + 1 + selectedText.length + 1)
      }
      // Jika tidak ada seleksi
      else {
        const newValue = `${beforeCursor}${e.key}${closingChar}${afterCursor}`

        setInternalValue(newValue)
        setCursorPosition(selectionStart + 1)
        saveToHistory(newValue, selectionStart + 1)
      }
    }
    // Handle "melompati" closing character jika diketik
    else if (Object.values(autoClosePairs).includes(e.key)) {
      if (value[selectionStart] === e.key) {
        e.preventDefault()
        setCursorPosition(selectionStart + 1)
      }
    }
    // Handle backspace untuk menghapus pasangan
    else if (e.key === 'Backspace') {
      const beforeCursor = value.substring(0, selectionStart)
      const afterCursor = value.substring(selectionEnd)

      // Cek apakah karakter sebelum dan sesudah kursor adalah pasangan yang cocok
      if (selectionStart === selectionEnd) {
        for (const [open, close] of Object.entries(autoClosePairs)) {
          if (
            beforeCursor.endsWith(open) &&
            afterCursor.startsWith(close) &&
            beforeCursor.length > 0 &&
            afterCursor.length > 0
          ) {
            e.preventDefault()
            const newValue = beforeCursor.slice(0, -1) + afterCursor.substring(1)
            setInternalValue(newValue)
            setCursorPosition(selectionStart - 1)
            saveToHistory(newValue, selectionStart - 1)
            return
          }
        }
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value
    const cursorPos = textareaRef.current?.selectionStart || 0

    if (!lastChangeWasUndoRedo.current) saveToHistory(internalValue, cursorPos)
    setInternalValue(newVal)
    setCursorPosition(cursorPos)

    try {
      const value: T | undefined = newVal.trim() ? JSON.parse(newVal) : undefined
      setParseError(null)
      onChange?.({ ...e, target: { ...e.target, name: rest.name || e.target.name, value } })
    } catch {
      setParseError('Invalid JSON format')
      onChange?.({ ...e, target: { ...e.target, name: rest.name || e.target.name, value: undefined } })
    }
  }

  const handleUndo = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--
      const prevState = historyRef.current[currentIndexRef.current]
      lastChangeWasUndoRedo.current = true
      setInternalValue(prevState.value)
      setCursorPosition(prevState.cursorPos)
    } else {
      // Fallback ke initial state jika sudah di awal history
      const initialState = historyRef.current[0]
      lastChangeWasUndoRedo.current = true
      setInternalValue(initialState.value)
      setCursorPosition(initialState.cursorPos)
    }
  }

  const handleRedo = () => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++
      const nextState = historyRef.current[currentIndexRef.current]
      lastChangeWasUndoRedo.current = true
      setInternalValue(nextState.value)
      setCursorPosition(nextState.cursorPos)
    }
  }

  return (
    <div className='relative rounded-lg border border-divider'>
      <div className='absolute top-1 right-1 flex gap-1 items-center'>
        {showFind && (
          <Search
            internalValue={internalValue}
            scrollableRef={scrollableRef}
            setShowFind={setShowFind}
            textareaRef={textareaRef}
            findInputRef={findInputRef}
          />
        )}
        <UndoRedo
          currentIndexRef={currentIndexRef}
          textareaRef={textareaRef}
          cursorPosition={cursorPosition}
          internalValue={internalValue}
          lastChangeWasUndoRedo={lastChangeWasUndoRedo}
          historyRef={historyRef}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
        />
      </div>
      <div ref={scrollableRef} className='rounded-[inherit] flex-col overflow-auto max-h-96'>
        <div className='flex'>
          <LineCount internalValue={internalValue} />
          <textarea
            ref={textareaRef}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={twMerge('font-mono text-sm flex-1 p-2 min-h-[300px] outline-none resize-none', className)}
            {...rest}
          />
        </div>
      </div>
      {parseError && (
        <div className='bg-error-light/30 border-t border-divider text-error-dark p-2 text-sm'>{parseError}</div>
      )}
    </div>
  )
}

export default JsonEditor
