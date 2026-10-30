'use client'
import { useState, MouseEvent } from 'react'

const MenuHoverHook = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  let currentlyHovering = false

  function onClick(event: MouseEvent<HTMLElement, globalThis.MouseEvent>) {
    if (anchorEl !== event.currentTarget) setAnchorEl(event.currentTarget)
  }

  const onMouseEnter = () => (currentlyHovering = true)

  const onClose = () => setAnchorEl(null)

  const onMouseLeave = () => {
    currentlyHovering = false
    setTimeout(() => (!currentlyHovering ? onClose() : null), 50)
  }

  return {
    button: { onClick, onMouseEnter: onClick, onMouseLeave },
    menu: { anchorEl, open, onClose, onMouseEnter, onMouseLeave }
  }
}

export default MenuHoverHook
