import { Logo } from '@/Logo'

import classes from './Header.module.css'

// provide sugar for authoring notification tab headers

type HeaderProps = {
  text: string
}

export const Header = ({ text }: HeaderProps) => {
  return (
    <div className={classes.Header}>
      <Logo size={48} />
      <h1>{text}</h1>
    </div>
  )
}
