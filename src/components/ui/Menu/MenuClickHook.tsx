import { useState, MouseEvent } from 'react'

const MenuClickHook = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const onClose = () => setAnchorEl(null)

  const onClick = (event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return {
    button: { onClick },
    menu: { anchorEl, open, onClose }
  }
}

export default MenuClickHook
