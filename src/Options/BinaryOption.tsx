import { useState, useEffect, useCallback } from 'react'

import { Checkbox } from './Checkbox'
import { options, getOptionLabel, BooleanOptionId } from '@/options'
import { getOption, setOption, makeStorageChangeHandler } from '@/storage'
import { sentenceCase } from '@/util/string'

import classes from './BinaryOption.module.css'

type BinaryOptionProps = {
  id: BooleanOptionId
}

// todo: consider useSyncExternalStore instead of useState, useEffect (possible because storage api has snapshot and subscription features)
export const BinaryOption = ({ id }: BinaryOptionProps) => {
  const [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    getOption(id).then(setChecked)
  }, [id])

  useEffect(() => {
    const handleStorageChanged = makeStorageChangeHandler((changes) => {
      if (changes.options) {
        setChecked(changes.options.newValue?.[id] ?? options[id])
      }
    })

    chrome.storage.onChanged.addListener(handleStorageChanged)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChanged)
    }
  }, [id])

  const handleClick = useCallback(() => {
    setOption(id, !checked)
  }, [id, checked])

  return (
    <div className={classes.BinaryOption}>
      <Checkbox
        checked={checked}
        onClick={handleClick}
      />
      <span
        className={classes.label}
        onClick={handleClick}
      >
        {sentenceCase(getOptionLabel(id))}
      </span>
    </div>
  )
}
