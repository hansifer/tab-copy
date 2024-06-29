type LogoProps = {
  size?: number
  topColor?: string
  topOpacity?: number
  lineColor?: string
  bottomColor?: string
  bottomOpacity?: number
}

export const Logo = ({
  size = 20,
  topColor = '#1c7c96',
  topOpacity = 0.5,
  lineColor = 'transparent',
  bottomColor = '#1c7c96',
  bottomOpacity = 1,
}: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="36 36 72 72"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          fill={topColor}
          opacity={topOpacity}
          d="M88.4,59.6h12.6c-4.9-11.3-16.1-19.2-29.1-19.2s-24.3,7.9-29.1,19.2h12.6c7.7,0,14,6.3,14,14v30.1c.8,0,1.7.1,2.5.1s1.7,0,2.5-.1v-30.1c0-7.7,6.3-14,14-14Z"
        />
        <path
          fill={bottomColor}
          opacity={bottomOpacity}
          d="M59.4,101.2v-27.7c0-2.2-1.8-4-4-4h-15.1c0,.8-.1,1.7-.1,2.5,0,13.1,7.9,24.3,19.2,29.1Z"
        />
        <path
          fill={bottomColor}
          opacity={bottomOpacity}
          d="M 84.4 101.226 L 84.4 73.526 C 84.4 71.326 86.2 69.529 88.4 69.534 L 103.5 69.566 C 103.5 70.366 103.6 71.266 103.6 72.066 C 103.6 85.166 95.7 96.35 84.4 101.126 L 84.4 101.226 Z"
        />
      </g>
      {lineColor ? (
        <g>
          <path
            fill={lineColor}
            d="M84.4,73.6c0-2.2,1.8-4,4-4h15.1c-.3-3.5-1.1-6.9-2.5-10h-12.6c-7.7,0-14,6.3-14,14v30.1c3.5-.3,6.9-1.1,10-2.4v-27.7Z"
          />
          <path
            fill={lineColor}
            d="M55.4,59.6h-12.6c-1.3,3.1-2.2,6.5-2.5,10h15.1c2.2,0,4,1.8,4,4v27.7c3.1,1.3,6.5,2.2,10,2.5v-30.1c0-7.7-6.3-14-14-14Z"
          />
        </g>
      ) : null}
    </svg>
  )
}
