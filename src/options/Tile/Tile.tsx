import { Checkbox } from '../Checkbox/Checkbox'
import { classy } from '@/util/css'

import classes from './Tile.module.css'

type TileProps<T extends string> = {
  id: T
  label: string
  description?: string
  tip?: string
  checked?: boolean
  disabled?: boolean
  onClick?: (id: T) => void
}

export function Tile<T extends string>({
  id,
  label,
  description,
  tip,
  checked,
  disabled,
  onClick,
}: TileProps<T>) {
  const textClassNames = classy(classes.text, {
    [classes.unchecked]: !checked,
  })

  return (
    <div
      className={classes.Tile}
      onClick={
        onClick
          ? () => {
              onClick(id)
            }
          : undefined
      }
    >
      <div className={classes.main}>
        <span className={classy(classes.side, classes.left)}>
          <Checkbox
            checked={checked}
            disabled={disabled}
          />
        </span>
        <span className={textClassNames}>
          <span>{label}</span>
          {description ? <span className={classes.description}>{description}</span> : null}
        </span>
        <span className={classy(classes.side, classes.right)}></span>
      </div>
      {tip ? <div className={classes.tip}>{tip}</div> : null}
    </div>
  )
}
