import { Checkbox } from './Checkbox'

import classes from './BinaryOption.module.css'

type BinaryOptionProps = {
  label: string
}

export const BinaryOption = ({ label }: BinaryOptionProps) => {
  return (
    <div className={classes.BinaryOption}>
      <Checkbox />
      <span>{label}</span>
    </div>
  )
}
