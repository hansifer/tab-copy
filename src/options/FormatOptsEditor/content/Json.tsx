import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { addOrRemove } from '@/util/array'

import { Checkbox } from '@/options/Checkbox/Checkbox'
import { TextOption } from '@/options/TextOption/TextOption'

import { ContentProps } from './interface'

import classes from './Json.module.css'
import optionsClasses from '../../Options.module.css'

// content components receive up-to-date option and are responsible for reporting option changes

// todo: add validation
// todo: consider range input for indent

const MAX_INDENT = 12

const availableTabProperties = [
  // wrap
  'title',
  'url',
  'favIconUrl',
] as const

export const Json = ({ option, onChange }: ContentProps<'json'>) => {
  return (
    <>
      <div className={optionsClasses.optsSection}>
        <div className={optionsClasses.optsSectionHeader}>{sentenceCase(intl.properties())}</div>
        <div className={classes.properties}>
          {availableTabProperties.map((prop) => {
            const checked = option.properties.includes(prop)

            return (
              <Checkbox
                key={prop}
                label={prop}
                checked={checked}
                disabled={checked && option.properties.length === 1}
                onClick={() => {
                  onChange({
                    ...option,
                    properties: addOrRemove(option.properties, prop),
                  })
                }}
              />
            )
          })}
        </div>
      </div>
      <div className={optionsClasses.optsSection}>
        <div className={optionsClasses.optsSectionHeader}>{sentenceCase(intl.layout())}</div>
        <div className={classes.layout}>
          <Checkbox
            label={sentenceCase(intl.pretty())}
            checked={option.pretty}
            onClick={() => {
              onChange({
                ...option,
                pretty: !option.pretty,
              })
            }}
          />
          <TextOption
            label={intl.indent()}
            value={option.indent}
            disabled={!option.pretty}
            type="number"
            width="60px"
            autoFocus
            onChange={(indent) => {
              onChange({
                ...option,
                indent: `${Math.min(MAX_INDENT, Math.max(0, parseInt(indent, 10) || 0))}`, // prevent decimals and enforce range
              })
            }}
          />
        </div>
      </div>
    </>
  )
}
