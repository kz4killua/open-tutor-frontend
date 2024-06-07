import Image from "next/image"


export function Icon({ 
  width, height
} : {
  width: number, height: number
}) {
  return (
    <Image 
      src={"/icon.svg"}
      alt="Open Tutor icon"
      width={width}
      height={height}
      />
  )
}