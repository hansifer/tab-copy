import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { addOrRemove } from '@/util/array'

import { MAX_INDENT_SIZE, parseIndent } from '@/format'
import { Checkbox } from '@/options/Checkbox/Checkbox'
import { TextOption } from '@/options/TextOption/TextOption'

import { ContentProps } from './interface'

import classes from './Json.module.css'
import optionsClasses from '../../Options.module.css'

// content components receive up-to-date opts and are responsible for reporting opts changes

// todo: consider range input for indent

const availableTabProperties = [
  // wrap
  'title',
  'url',
  'favIconUrl',
] as const

export const Json = ({ opts, onChange }: ContentProps<'json'>) => {
  return (
    <>
      <div className={optionsClasses.optsSection}>
        <div className={optionsClasses.optsSectionHeader}>{sentenceCase(intl.properties())}</div>
        <div className={classes.properties}>
          {availableTabProperties.map((prop) => {
            const checked = opts.properties.includes(prop)

            return (
              <Checkbox
                key={prop}
                label={prop}
                checked={checked}
                disabled={checked && opts.properties.length === 1}
                onClick={() => {
                  onChange({
                    ...opts,
                    properties: addOrRemove(opts.properties, prop),
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
            checked={opts.pretty}
            onClick={() => {
              onChange({
                ...opts,
                pretty: !opts.pretty,
              })
            }}
          />
          <TextOption
            label={intl.indent()}
            value={opts.indent}
            disabled={!opts.pretty}
            invalid={!parseIndent(opts.indent)}
            type="number"
            min={1}
            max={MAX_INDENT_SIZE}
            width="60px"
            autoFocus
            onChange={(indent) => {
              onChange({
                ...opts,
                indent: `${parseInt(indent, 10) || ''}`, // prevent decimals
              })
            }}
          />
        </div>
      </div>
    </>
  )
}
