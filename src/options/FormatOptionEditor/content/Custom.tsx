import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { classy } from '@/util/css'

import { TextOption } from '@/options/TextOption/TextOption'
import { ContentProps } from './interface'
import classes from './Custom.module.css'
import optionsClasses from '../../Options.module.css'

// content components receive up-to-date option and are responsible for reporting option changes

// todo: add validation

export const Custom = ({ option, onChange, onConfirmDelete }: ContentProps<'custom-*'>) => {
  return (
    <div className={classes.Custom}>
      <TextOption
        label={intl.name()}
        value={option.name}
        maxLength={30}
        autoFocus
        onChange={(name) => {
          onChange({
            ...option,
            name,
          })
        }}
      />
      <TextOption
        label={intl.header()}
        value={option.template.header}
        onChange={(header) => {
          onChange({
            ...option,
            template: {
              ...option.template,
              header,
            },
          })
        }}
      />
      <TextOption
        label={intl.tab()}
        value={option.template.tab}
        onChange={(tab) => {
          onChange({
            ...option,
            template: {
              ...option.template,
              tab,
            },
          })
        }}
      />
      <TextOption
        label={intl.delimiter()}
        value={option.template.delimiter}
        onChange={(delimiter) => {
          onChange({
            ...option,
            template: {
              ...option.template,
              delimiter,
            },
          })
        }}
      />
      <TextOption
        label={intl.footer()}
        value={option.template.footer}
        onChange={(footer) => {
          onChange({
            ...option,
            template: {
              ...option.template,
              footer,
            },
          })
        }}
      />
      {onConfirmDelete ? (
        <div>
          <button
            className={classy(optionsClasses.primaryAction, optionsClasses.destructiveAction)}
            onClick={() => onConfirmDelete()}
          >
            {sentenceCase(intl.deleteFormat())}
          </button>
        </div>
      ) : null}
    </div>
  )
}
