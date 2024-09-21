import { useState, useEffect, useCallback } from 'react'

import { Checkbox } from '../Checkbox/Checkbox'
import {
  getOption,
  getSubOptions,
  isBooleanOption,
  BooleanOption,
  BooleanOptionId,
} from '@/options'
import { setOptionValue, makeStorageChangeHandler } from '@/storage'
import { sentenceCase } from '@/util/string'

import classes from './BinaryOption.module.css'

type BinaryOptionProps = {
  id: BooleanOptionId
}

// todo: consider useSyncExternalStore instead of useState, useEffect (possible because storage api has snapshot and subscription features)
export const BinaryOption = ({ id }: BinaryOptionProps) => {
  const [option, setOption] = useState<BooleanOption | null>(null)

  // only display sub-options if this option is checked
  const subOptions = option?.value // wrap
    ? getSubOptions(id)
    : []

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

  const handleClick = useCallback(async () => {
    if (!option) return

    if ('requiresPermissions' in option && option.requiresPermissions) {
      if (option.value) {
        await chrome.permissions.remove({
          permissions: option.requiresPermissions,
        })
      } else {
        const granted = await chrome.permissions.request({
          permissions: option.requiresPermissions,
        })

        if (!granted) return
      }
    }

    setOptionValue(id, !option.value)
  }, [id, option?.value])

  return (
    <>
      <Checkbox
        label={sentenceCase(option?.label())}
        tip={sentenceCase(option && 'description' in option ? option.description() : '')}
        checked={option?.value}
        disabled={!option}
        onClick={() => handleClick()}
      />
      {subOptions
        .filter((option) => isBooleanOption(option)) // only boolean sub-options are supported for now
        .map(({ id }) => (
          <div
            key={id}
            className={classes.subOption}
          >
            <BinaryOption id={id} />
          </div>
        ))}
    </>
  )
}
