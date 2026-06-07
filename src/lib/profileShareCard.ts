export interface ContributorShareCardData {
  activeDays: number
  approvedEntries: number
  community?: string
  currentRank: number | null
  currentStreak: number
  displayName: string
  longestStreak: number
  photoURL?: string
  points: number
  rankBadgeId: string
  rankTitle: string
  totalAchievements: number
  trustScore: number
  unlockedAchievements: number
}

const cardWidth = 1200
const cardHeight = 1500

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PK'

const roundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const safeRadius = Math.min(radius, width / 2, height / 2)

  context.beginPath()
  context.moveTo(x + safeRadius, y)
  context.lineTo(x + width - safeRadius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius)
  context.lineTo(x + width, y + height - safeRadius)
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height,
  )
  context.lineTo(x + safeRadius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius)
  context.lineTo(x, y + safeRadius)
  context.quadraticCurveTo(x, y, x + safeRadius, y)
  context.closePath()
}

const fillRoundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: CanvasRenderingContext2D['fillStyle'],
) => {
  context.save()
  roundRect(context, x, y, width, height, radius)
  context.fillStyle = fillStyle
  context.fill()
  context.restore()
}

const strokeRoundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: CanvasRenderingContext2D['strokeStyle'],
  lineWidth: number,
) => {
  context.save()
  roundRect(context, x, y, width, height, radius)
  context.strokeStyle = strokeStyle
  context.lineWidth = lineWidth
  context.stroke()
  context.restore()
}

const drawFittedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  weight: number,
  color: string,
) => {
  let size = fontSize
  context.textBaseline = 'top'
  context.fillStyle = color

  do {
    context.font = `${weight} ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
    if (context.measureText(text).width <= maxWidth || size <= 34) {
      break
    }
    size -= 2
  } while (size > 34)

  context.fillText(text, x, y, maxWidth)
}

const drawMetricCard = (
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  color: string,
) => {
  const gradient = context.createLinearGradient(x, y, x + width, y + 145)
  gradient.addColorStop(0, 'rgba(255,255,255,0.16)')
  gradient.addColorStop(1, 'rgba(255,255,255,0.06)')
  fillRoundRect(context, x, y, width, 145, 30, gradient)
  strokeRoundRect(context, x, y, width, 145, 30, 'rgba(255,255,255,0.18)', 2)

  context.fillStyle = color
  context.font =
    '900 42px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.textBaseline = 'top'
  context.fillText(value, x + 28, y + 26, width - 56)

  context.fillStyle = 'rgba(255,255,255,0.68)'
  context.font =
    '700 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillText(label, x + 28, y + 92, width - 56)
}

const drawAvatar = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  name: string,
  x: number,
  y: number,
  size: number,
) => {
  context.save()
  context.beginPath()
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
  context.closePath()
  context.fillStyle = '#f5c84b'
  context.fill()

  context.beginPath()
  context.arc(x + size / 2, y + size / 2, size / 2 - 10, 0, Math.PI * 2)
  context.clip()

  if (image) {
    const scale = Math.max(size / image.width, size / image.height)
    const drawWidth = image.width * scale
    const drawHeight = image.height * scale
    context.drawImage(
      image,
      x + (size - drawWidth) / 2,
      y + (size - drawHeight) / 2,
      drawWidth,
      drawHeight,
    )
  } else {
    const gradient = context.createLinearGradient(x, y, x + size, y + size)
    gradient.addColorStop(0, '#f5c84b')
    gradient.addColorStop(1, '#0b4b2b')
    context.fillStyle = gradient
    context.fillRect(x, y, size, size)
    context.fillStyle = '#ffffff'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font =
      '900 78px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    context.fillText(getInitials(name), x + size / 2, y + size / 2)
    context.textAlign = 'left'
  }

  context.restore()
}

const drawPattern = (context: CanvasRenderingContext2D) => {
  context.save()
  context.strokeStyle = 'rgba(245,200,75,0.16)'
  context.lineWidth = 3

  for (let y = 130; y < cardHeight; y += 92) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(cardWidth, y + 260)
    context.stroke()
  }

  context.strokeStyle = 'rgba(255,255,255,0.07)'
  for (let x = -80; x < cardWidth; x += 110) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x + 290, cardHeight)
    context.stroke()
  }

  context.restore()
}

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
        return
      }

      reject(new Error('Profile share PNG could not be created.'))
    }, 'image/png')
  })

export const getContributorShareFileName = (displayName: string): string => {
  const slug =
    displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'project-kasena-contributor'

  return `${slug}-impact-card.png`
}

export const generateContributorShareCard = async (
  data: ContributorShareCardData,
): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = cardWidth
  canvas.height = cardHeight
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas is not available.')
  }

  const [rankBadge, shareBadge, avatar] = await Promise.all([
    loadImage(`/ranks/${data.rankBadgeId}.png`).catch(() => null),
    loadImage('/icons/share-impact.png').catch(() => null),
    data.photoURL ? loadImage(data.photoURL).catch(() => null) : null,
  ])

  const background = context.createLinearGradient(0, 0, cardWidth, cardHeight)
  background.addColorStop(0, '#061b15')
  background.addColorStop(0.45, '#0b4b2b')
  background.addColorStop(1, '#10211f')
  context.fillStyle = background
  context.fillRect(0, 0, cardWidth, cardHeight)
  drawPattern(context)

  const warmBand = context.createLinearGradient(0, 0, cardWidth, 0)
  warmBand.addColorStop(0, 'rgba(245,200,75,0.95)')
  warmBand.addColorStop(0.55, 'rgba(201,106,45,0.9)')
  warmBand.addColorStop(1, 'rgba(245,200,75,0.2)')
  context.save()
  context.translate(-120, 160)
  context.rotate(-0.12)
  fillRoundRect(context, 0, 0, cardWidth + 240, 68, 34, warmBand)
  context.restore()

  fillRoundRect(context, 72, 86, 1056, 1328, 56, 'rgba(255,255,255,0.08)')
  strokeRoundRect(
    context,
    72,
    86,
    1056,
    1328,
    56,
    'rgba(255,255,255,0.2)',
    2,
  )

  context.fillStyle = '#f5c84b'
  context.font =
    '900 28px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillText('PROJECT KASENA', 126, 134)
  context.fillStyle = 'rgba(255,255,255,0.76)'
  context.font =
    '700 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillText('Contributor Impact Card', 126, 172)

  if (shareBadge) {
    context.drawImage(shareBadge, 940, 116, 112, 112)
  }

  drawAvatar(context, avatar, data.displayName, 126, 266, 250)

  if (rankBadge) {
    context.drawImage(rankBadge, 814, 250, 260, 260)
  }

  drawFittedText(
    context,
    data.displayName,
    126,
    560,
    720,
    72,
    950,
    '#ffffff',
  )
  context.fillStyle = '#f5c84b'
  context.font =
    '900 36px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillText(data.rankTitle, 126, 644, 720)

  const community = data.community?.trim()
  if (community) {
    fillRoundRect(context, 126, 704, 360, 52, 26, 'rgba(245,200,75,0.18)')
    context.fillStyle = '#ffe8a3'
    context.font =
      '800 21px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    context.fillText(community, 150, 718, 312)
  }

  const metricWidth = 320
  const metricGap = 32
  const left = 126
  const top = 824
  const secondLeft = left + metricWidth + metricGap
  const thirdLeft = secondLeft + metricWidth + metricGap

  drawMetricCard(
    context,
    'Total Points',
    data.points.toLocaleString(),
    left,
    top,
    metricWidth,
    '#f5c84b',
  )
  drawMetricCard(
    context,
    'Trust Score',
    `${data.trustScore}%`,
    secondLeft,
    top,
    metricWidth,
    '#c7f6d6',
  )
  drawMetricCard(
    context,
    'Approved Entries',
    data.approvedEntries.toLocaleString(),
    thirdLeft,
    top,
    metricWidth,
    '#ffd5ad',
  )
  drawMetricCard(
    context,
    'Current Streak',
    `${data.currentStreak} days`,
    left,
    top + 176,
    metricWidth,
    '#ffffff',
  )
  drawMetricCard(
    context,
    'Achievements',
    `${data.unlockedAchievements}/${data.totalAchievements}`,
    secondLeft,
    top + 176,
    metricWidth,
    '#f5c84b',
  )
  drawMetricCard(
    context,
    'Leaderboard Rank',
    data.currentRank ? `#${data.currentRank.toLocaleString()}` : 'Soon',
    thirdLeft,
    top + 176,
    metricWidth,
    '#c7f6d6',
  )

  fillRoundRect(context, 126, 1210, 948, 108, 32, 'rgba(255,255,255,0.1)')
  context.fillStyle = '#ffffff'
  context.font =
    '900 30px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillText('Preserving Kasem with trusted community knowledge', 154, 1234)
  context.fillStyle = 'rgba(255,255,255,0.68)'
  context.font =
    '700 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillText(
    `${data.activeDays.toLocaleString()} active days recorded | Longest streak: ${data.longestStreak.toLocaleString()} days`,
    154,
    1276,
    880,
  )

  context.fillStyle = 'rgba(255,255,255,0.55)'
  context.font =
    '800 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillText('project-kassena-7e026.web.app', 126, 1372)
  context.fillStyle = '#f5c84b'
  context.fillRect(126, 1352, 198, 5)

  return canvasToBlob(canvas)
}

export const shareOrDownloadContributorCard = async (
  blob: Blob,
  fileName: string,
  shareText: string,
) => {
  const file = new File([blob], fileName, { type: 'image/png' })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: 'Project Kasena contributor impact',
        text: shareText,
        files: [file],
      })
      return 'shared'
    } catch {
      // Fall through to a download when the platform share sheet is cancelled
      // or file sharing is unavailable after capability probing.
    }
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}
