import shortlinkGif from '@/assets/resodine.gif'

export function ShortlinkCard() {
  return (
    <img
      src={shortlinkGif}
      alt="Shortlink Tools"
      class="w-20 h-20 relative z-10 object-contain drop-shadow-md"
    />
  )
}
