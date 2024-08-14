import { useState, useEffect, useCallback } from 'react'

import { Checkbox } from '../Checkbox/Checkbox'
import { getOption, BooleanOption, BooleanOptionId } from '@/options'
import { setOptionValue, makeStorageChangeHandler } from '@/storage'
import { sentenceCase } from '@/util/string'

type BinaryOptionProps = {
  id: BooleanOptionId
}

// todo: consider useSyncExternalStore instead of useState, useEffect (possible because storage api has snapshot and subscription features)
export const BinaryOption = ({ id }: BinaryOptionProps) => {
  const [option, setOption] = useState<BooleanOption | null>(null)

  useEffect(() => {
    getOption(id).then(setOption)
  }, [id])

  useEffect(() => {
    const handleStorageChanged = makeStorageChangeHandler((changes) => {
      if (changes.options) {
        getOption(id).then(setOption)
      }
    })

    chrome.storage.onChanged.addListener(handleStorageChanged)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChanged)
    }
  }, [id])

  const handleClick = useCallback(() => {
    if (!option) return
    setOptionValue(id, !option.value)
  }, [id, option?.value])

  return (
    <Checkbox
      label={sentenceCase(option?.label())}
      tip={sentenceCase(option && 'description' in option ? option.description() : '')}
      checked={option?.value}
      disabled={!option}
      onClick={() => handleClick()}
    />
  )
}
