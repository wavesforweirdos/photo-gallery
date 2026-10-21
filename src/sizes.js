// Tile width is relative to the other photos in the same batch, so every search gets a varied
// mosaic regardless of how popular its results are: the top 20% by likes span two columns.
// Tiles never span rows, so every row starts and ends at the same height.
export function assignSizes(photos) {
  const wideCount = Math.max(1, Math.round(photos.length / 5))
  const wideIds = new Set(
    [...photos]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, wideCount)
      .map(photo => photo.id),
  )
  return photos.map(photo => ({ ...photo, size: wideIds.has(photo.id) ? 'wide' : '' }))
}
