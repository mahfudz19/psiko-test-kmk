import { Editor } from '@tiptap/react'
import { useEffect } from 'react'

export function useColumnResize(editor: Editor | null) {
  useEffect(() => {
    if (!editor) return

    let isResizing = false
    let startX = 0
    let startWidth = 0
    let currentCell: HTMLElement | null = null
    let cellIndex = -1 // Simpan index sel di awal drag

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Cek apakah klik terjadi di area resize (pseudo-element ::after)
      if (target.matches('th:not(:last-child), td:not(:last-child)')) {
        const rect = target.getBoundingClientRect()
        const clickX = e.clientX
        const rightEdge = rect.right

        // Cek apakah klik terjadi di area 12px dari border kanan
        if (clickX >= rightEdge - 6 && clickX <= rightEdge + 6) {
          e.preventDefault()

          // Validasi parentElement sebelum memulai resize
          const parentElement = target.parentElement
          if (!parentElement || !parentElement.children) return

          isResizing = true
          startX = e.clientX
          currentCell = target
          startWidth = target.offsetWidth

          // Simpan index sel di awal untuk menghindari masalah saat DOM berubah
          cellIndex = Array.from(parentElement.children).indexOf(target)

          // Ubah kursor untuk seluruh dokumen
          document.body.style.cursor = 'col-resize'
          document.body.style.userSelect = 'none'
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !currentCell || cellIndex === -1) return

      // Validasi apakah currentCell masih ada di DOM
      if (!currentCell.isConnected) {
        handleMouseUp()
        return
      }

      const diff = e.clientX - startX
      const newWidth = Math.max(50, startWidth + diff) // Minimum width 50px

      try {
        // Update width sel dengan try-catch untuk safety
        currentCell.style.width = `${newWidth}px`
        currentCell.style.minWidth = `${newWidth}px`

        // Jika ini adalah header, update semua sel di kolom yang sama
        if (currentCell.tagName === 'TH') {
          const table = currentCell.closest('table')

          if (table) {
            const rows = table.querySelectorAll('tr')
            rows.forEach(row => {
              // Pastikan row.children ada dan cellIndex valid
              if (row.children && cellIndex < row.children.length) {
                const cell = row.children[cellIndex] as HTMLElement
                if (cell && cell !== currentCell && cell.isConnected) {
                  cell.style.width = `${newWidth}px`
                  cell.style.minWidth = `${newWidth}px`
                }
              }
            })
          }
        }
      } catch {
        handleMouseUp()
      }
    }

    const handleMouseUp = () => {
      if (isResizing) {
        isResizing = false
        currentCell = null
        cellIndex = -1 // Reset index

        // Reset kursor
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }

    // Tambahkan handler untuk membersihkan state jika terjadi error atau interupsi
    const handleVisibilityChange = () => {
      if (document.hidden && isResizing) {
        handleMouseUp()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hentikan resize jika user menekan Escape
      if (e.key === 'Escape' && isResizing) {
        handleMouseUp()
      }
    }

    // Tambahkan event listener ke editor container
    const editorElement = editor.view.dom
    editorElement.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      editorElement.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('keydown', handleKeyDown)

      // Cleanup jika masih dalam mode resize
      if (isResizing) {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [editor])
}
