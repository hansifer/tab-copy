import { useState, useEffect, useCallback } from 'react'

import { Checkbox } from '../Checkbox/Checkbox'
import { selectOption, getOptionLabel, BooleanOptionId } from '@/options'
import { getOption, setOption, makeStorageChangeHandler } from '@/storage'
import { sentenceCase } from '@/util/string'

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
        setChecked(selectOption(id, changes.options.newValue))
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
    <Checkbox
      label={sentenceCase(getOptionLabel(id))}
      checked={checked}
      onClick={handleClick}
    />
  )
}
