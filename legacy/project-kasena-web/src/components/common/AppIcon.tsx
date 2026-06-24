export type AppIconName =
  | 'activity'
  | 'admin'
  | 'alert'
  | 'airtime'
  | 'analytics'
  | 'arrow-left'
  | 'arrowLeft'
  | 'audio'
  | 'badge'
  | 'bell'
  | 'book'
  | 'calendar'
  | 'camera'
  | 'check'
  | 'chevron-right'
  | 'chevronRight'
  | 'clipboard'
  | 'close'
  | 'community'
  | 'data'
  | 'delete'
  | 'download'
  | 'edit'
  | 'external'
  | 'favorite'
  | 'file'
  | 'gift'
  | 'globe'
  | 'heart'
  | 'history'
  | 'home'
  | 'info'
  | 'leaf'
  | 'lock'
  | 'medal'
  | 'megaphone'
  | 'menu'
  | 'medical'
  | 'merch'
  | 'microphone'
  | 'mic'
  | 'person'
  | 'pause'
  | 'play'
  | 'points'
  | 'proverb'
  | 'refresh'
  | 'reward'
  | 'search'
  | 'send'
  | 'sentence'
  | 'settings'
  | 'share'
  | 'shield'
  | 'song'
  | 'speaker'
  | 'spark'
  | 'star'
  | 'streak'
  | 'target'
  | 'timeline'
  | 'trash'
  | 'trophy'
  | 'upload'
  | 'user'
  | 'users'
  | 'volume'
  | 'words'
  | 'x'

const iconAliases: Record<string, string> = {
  alert: 'admin',
  airtime: 'points',
  arrowLeft: 'arrow-left',
  chevronRight: 'chevron-right',
  clipboard: 'words',
  delete: 'trash',
  favorite: 'heart',
  file: 'data',
  mic: 'microphone',
  person: 'user',
  sentence: 'words',
  volume: 'speaker',
  x: 'close',
}

const customIconPaths: Record<string, string> = {
  share: '/icons/share-impact.png',
  streak: '/icons/contribution-streak.png',
}

const getAppIconPath = (name: AppIconName | string): string => {
  const id = iconAliases[name] ?? name

  return customIconPaths[id] ?? `/icons/ui/${id}.png`
}

export const AppIcon = ({
  alt = '',
  className = 'h-5 w-5',
  name,
}: {
  alt?: string
  className?: string
  name: AppIconName | string
}) => (
  <img
    src={getAppIconPath(name)}
    alt={alt}
    className={`${className} shrink-0 object-contain align-middle`}
    onError={(event) => {
      if (event.currentTarget.src.endsWith('/icons/ui/spark.png')) {
        return
      }
      event.currentTarget.src = '/icons/ui/spark.png'
    }}
    draggable={false}
    loading="lazy"
  />
)
