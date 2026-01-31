/**
 * Accessibility utilities and helpers
 */

/**
 * Generate ARIA label for pagination
 */
export function getPaginationAriaLabel(
  currentPage: number,
  totalPages: number,
  totalItems: number
): string {
  return `Sayfa ${currentPage} / ${totalPages}, Toplam ${totalItems} kayıt`
}

/**
 * Generate ARIA label for table row
 */
export function getTableRowAriaLabel(
  rowIndex: number,
  totalRows: number,
  itemName?: string
): string {
  return `${itemName || "Satır"} ${rowIndex + 1} / ${totalRows}`
}

/**
 * Generate ARIA label for action button
 */
export function getActionButtonAriaLabel(
  action: string,
  itemName?: string
): string {
  return `${action} ${itemName || "öğe"}`
}

/**
 * Keyboard navigation helpers
 */
export const KEYBOARD_KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
} as const

/**
 * Check if key is a navigation key
 */
const NAV_KEYS: readonly string[] = [
  KEYBOARD_KEYS.ARROW_UP,
  KEYBOARD_KEYS.ARROW_DOWN,
  KEYBOARD_KEYS.ARROW_LEFT,
  KEYBOARD_KEYS.ARROW_RIGHT,
  KEYBOARD_KEYS.TAB,
]

const ACTION_KEYS: readonly string[] = [
  KEYBOARD_KEYS.ENTER,
  KEYBOARD_KEYS.SPACE,
]

/**
 * Check if key is a navigation key
 */
export function isNavigationKey(key: string): boolean {
  return NAV_KEYS.includes(key)
}

/**
 * Check if key is an action key
 */
export function isActionKey(key: string): boolean {
  return ACTION_KEYS.includes(key)
}
