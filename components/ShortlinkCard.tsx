import shortlinkGif from '@/assets/rosedino.gif'

export function ShortlinkCard() {
  return (
    <img
      src={shortlinkGif}
      alt="Shortlink Tools"
      class="w-40 h-40 relative z-10 object-contain drop-shadow-md"
    />
  )
}
