import classes from './NavBarItem.module.css'

type NavBarItemProps = {
  label?: string
  icon?: JSX.Element
  href: string
}

export const NavBarItem = ({ label, icon, href }: NavBarItemProps) => {
  return (
    <a
      className={classes.NavBarItem}
      href={href}
      target="_blank"
    >
      {icon ? <div className={classes.icon}>{icon}</div> : null}
      {label ? <div>{label}</div> : null}
    </a>
  )
}
