// Tile size is relative to the other photos in the same batch, so every search gets a varied
// mosaic regardless of how popular its results are: the top 10% by likes are big, the next 10%
// tall and the next 10% wide.
export function assignSizes(photos) {
  const step = Math.max(1, Math.round(photos.length / 10))
  const ranked = [...photos].sort((a, b) => b.likes - a.likes)
  const sizes = new Map()
  ranked.forEach((photo, index) => {
    const band = Math.floor(index / step)
    sizes.set(photo.id, ['big', 'tall', 'wide'][band] ?? '')
  })
  return photos.map(photo => ({ ...photo, size: sizes.get(photo.id) }))
}
