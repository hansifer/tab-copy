import { useState } from 'react'
import { Reorder, useMotionValue, useDragControls } from 'framer-motion'

import { Checkbox } from '../Checkbox/Checkbox'
import { OptionIcon } from './OptionIcon'
import { useRaisedShadow } from './useRaisedShadow'
import {
  // wrap
  isFormatWithOptsId,
  FormatId,
  FormatWithOptsId,
} from '@/format'
import { ConfiguredFormat } from '@/configured-format'
import { classy } from '@/util/css'

import classes from './FormatConfig.module.css'

type FormatConfigProps = {
  format: ConfiguredFormat
  disabled?: boolean
  description?: string
  onClick: (id: FormatId) => void
  onOptionClick?: (id: FormatWithOptsId) => void
}

export const FormatConfig = ({
  format,
  disabled,
  description,
  onClick,
  onOptionClick,
}: FormatConfigProps) => {
  // used to prevent click event from firing on drag end
  // todo: consider using a ref instead
  // todo: is there a cleaner way to do this? perhaps via a framer motion feature?
  const [allowClick, setAllowClick] = useState<boolean>(true)

  const y = useMotionValue(0)
  const dragControls = useDragControls()
  const boxShadow = useRaisedShadow(y)

  const textClassNames = classy({
    [classes.text]: true,
    [classes.hidden]: !format.visible,
  })

  return (
    <Reorder.Item
      value={format}
      id={format.id}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      onPointerDown={(e) => dragControls.start(e)}
      onClick={
        allowClick
          ? () => {
              onClick(format.id)
            }
          : undefined
      }
      onDragStart={() => {
        setAllowClick(false)
      }}
      onDragEnd={() => {
        setAllowClick(true)
      }}
    >
      <span className={classy(classes.side, classes.left)}>
        <Checkbox
          checked={format.visible}
          disabled={disabled}
        />
      </span>
      <span className={textClassNames}>
        <span>{format.label}</span>
        <span className={classes.description}>{description}</span>
      </span>
      <span
        className={classy(classes.side, classes.right)}
        onClick={
          format.opts
            ? (e) => {
                e.stopPropagation()
              }
            : undefined
        }
      >
        {format.opts ? (
          <button
            onClick={
              allowClick
                ? () => {
                    if (isFormatWithOptsId(format.id)) {
                      onOptionClick?.(format.id)
                    }
                  }
                : undefined
            }
          >
            <OptionIcon />
          </button>
        ) : null}
      </span>
    </Reorder.Item>
  )
}
