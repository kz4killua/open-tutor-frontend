export function formatFileSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']

  if (bytes === 0) {
    return '0 B'
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + units[i]
}