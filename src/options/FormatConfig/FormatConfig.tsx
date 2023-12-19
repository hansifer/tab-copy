import { useState } from 'react'
import { Reorder, useMotionValue, useDragControls } from 'framer-motion'

import { Checkbox } from '../Checkbox/Checkbox'
import { ConfigIcon } from './ConfigIcon'
import { useRaisedShadow } from './useRaisedShadow'
import { FormatId } from '@/format'
import { ConfiguredFormat } from '@/configured-format'
import { classy } from '@/util/css'

import classes from './FormatConfig.module.css'

type FormatConfigProps = {
  format: ConfiguredFormat<FormatId>
  disabled?: boolean
  description?: string
  onClick: (id: FormatId) => void
  onConfigClick?: (id: FormatId) => void
}

export const FormatConfig = ({
  format,
  disabled,
  description,
  onClick,
  onConfigClick,
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
    [classes.unselectable]: !format.selectable,
    [classes.primary]: format.primary,
  })

  const sideRightClassNames = classy(classes.side, classes.right)

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
      <span className={classes.side}>
        <Checkbox
          checked={format.selectable}
          disabled={disabled}
        />
      </span>
      <span className={textClassNames}>
        <span>{format.label}</span>
        <span className={classes.description}>{description}</span>
      </span>
      <span className={sideRightClassNames}>
        {format.option ? (
          <button
            onClick={
              allowClick
                ? (e) => {
                    onConfigClick?.(format.id)
                    e.stopPropagation()
                  }
                : undefined
            }
          >
            <ConfigIcon />
          </button>
        ) : null}
      </span>
    </Reorder.Item>
  )
}
