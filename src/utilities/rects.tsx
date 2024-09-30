// https://phuoc.ng/collection/1-loc/check-if-a-given-dom-rect-is-contained-within-another-dom-rect/
export function isContained(target: DOMRect, container: DOMRect): boolean {
  return (
    target.left >= container.left &&
    target.left + target.width <= container.left + container.width &&
    target.top >= container.top &&
    target.top + target.height <= container.top + container.height
  )
}