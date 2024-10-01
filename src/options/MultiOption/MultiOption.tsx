import Select from 'react-select'

import { sentenceCase } from '@/util/string'

import classes from './MultiOption.module.css'

// todo: add validation feature

export type Option = {
  value: string
  label: string
}

type MultiOptionProps = {
  label: string
  defaultValue: string
  options: Option[]
  disabled?: boolean
  autoFocus?: boolean
  onChange: (option: Option | null) => void
  onKeyDown?: React.ComponentProps<Select>['onKeyDown']
  onMenuClose?: React.ComponentProps<Select>['onMenuClose']
  onMenuOpen?: React.ComponentProps<Select>['onMenuOpen']
}

export const MultiOption = ({
  label,
  defaultValue,
  options,
  disabled,
  autoFocus,
  onChange,
  onKeyDown,
  onMenuClose,
  onMenuOpen,
}: MultiOptionProps) => {
  return (
    <div className={classes.MultiOption}>
      <div className={classes.label}>{sentenceCase(label)}</div>
      <Select
        className={classes.control}
        classNamePrefix={'multi-option'}
        defaultValue={options.find((option) => option.value === defaultValue)}
        options={options}
        isSearchable
        isDisabled={disabled}
        autoFocus={autoFocus}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onMenuClose={onMenuClose}
        onMenuOpen={onMenuOpen}
        menuPortalTarget={document.body}
      />
    </div>
  )
}
