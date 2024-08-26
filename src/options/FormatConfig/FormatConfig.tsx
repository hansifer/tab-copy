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
import { sentenceCase } from '@/util/string'
import { intl } from '@/intl'

import classes from './FormatConfig.module.css'

type FormatConfigProps = {
  format: ConfiguredFormat
  disabled?: boolean
  description?: string
  onClick: (id: FormatId) => void
  onOptsClick?: (id: FormatWithOptsId) => void
}

export const FormatConfig = ({
  format,
  disabled,
  description,
  onClick,
  onOptsClick,
}: FormatConfigProps) => {
  // used to prevent click event from firing on drag end
  // todo: consider using a ref instead
  // todo: is there a cleaner way to do this? perhaps via a framer motion feature?
  const [dragging, setDragging] = useState<boolean>(false)

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
        dragging
          ? undefined
          : () => {
              onClick(format.id)
            }
      }
      onDragStart={() => {
        setDragging(true)
      }}
      onDragTransitionEnd={() => {
        setDragging(false)
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
              dragging
                ? undefined
                : () => {
                    if (isFormatWithOptsId(format.id)) {
                      onOptsClick?.(format.id)
                    }
                  }
            }
          >
            <OptionIcon />
          </button>
        ) : null}
      </span>
      {format.description && !dragging ? (
        <div className={classes.tip}>
          <span className={classes.tipFormatDescription}>{format.description}</span>
          <span className={classes.tipFormatOpts}>{sentenceCase(intl.formatOpts())}</span>
        </div>
      ) : null}
    </Reorder.Item>
  )
}
