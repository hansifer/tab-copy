import { templateFields } from '@/template-field'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { classy } from '@/util/css'

import { TextOption } from '@/options/TextOption/TextOption'

import { ContentProps } from './interface'
import { TemplateField } from './TemplateField'

import classes from './Custom.module.css'
import optionsClasses from '../../Options.module.css'

// content components receive up-to-date opts and are responsible for reporting opts changes

// todo: add more validation

export const Custom = ({ opts, onChange, onConfirmDelete }: ContentProps<'custom-*'>) => {
  const previewText = ''

  //   const previewText = `[8:46:18 AM]

  // My format

  // 1) Title: Example 1
  //     URL:   https://www.example.com/

  // 2) Title: Example 2
  //     URL:   http://example.com/search?q=kittens

  // 3) Title: Example 3
  //     URL:   http://examsdfsdfsdfsdfsdfsfple.com/folder/doc.html#fragment
  // `

  return (
    <>
      <TextOption
        label={intl.name()}
        value={opts.name}
        maxLength={30}
        width="200px"
        autoFocus
        onChange={(name) => {
          onChange({
            ...opts,
            name,
          })
        }}
      />
      <div className={classes.templateScroll}>
        <div className={classes.template}>
          {templateFields.map(({ id, label, tokens }) => (
            <TemplateField
              key={id}
              id={id}
              label={label()}
              tokens={tokens}
              opts={opts}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
      {previewText ? (
        <div className={classes.preview}>
          <div
            className={classes.previewText}
            tabIndex={-1}
          >
            {previewText}
          </div>
          <div className={classes.previewLabel}>{sentenceCase(intl.preview())}</div>
        </div>
      ) : null}
      {onConfirmDelete ? (
        <button
          className={classy(optionsClasses.primaryAction, optionsClasses.destructiveAction)}
          onClick={() => onConfirmDelete()}
        >
          {sentenceCase(intl.deleteFormat())}
        </button>
      ) : null}
    </>
  )
}
