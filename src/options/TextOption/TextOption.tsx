import { useState, useEffect, useRef, HTMLInputTypeAttribute } from 'react'

import { sentenceCase } from '@/util/string'
import { insertInputText } from '@/util/dom'
import { classy } from '@/util/css'
import {
  Token,
  makeTokenRegExp,
  selectionOverlapsToken,
} from '@/options/FormatOptsEditor/content/tokens'
import { intl } from '@/intl'

import classes from './TextOption.module.css'

// todo: add validation feature

const MAX_COLLAPSED_TOKENS = 3

type TextOptionProps = {
  label: string
  value: string
  disabled?: boolean
  type?: Extract<
    HTMLInputTypeAttribute,
    'text' | 'number' | 'date' | 'datetime-local' | 'email' | 'month' | 'time' | 'url' | 'week'
  >
  width?: string
  maxLength?: number
  autoFocus?: boolean
  tokens?: Token[]
  onChange: (value: string) => void
}

export const TextOption = ({
  // wrap
  label,
  value,
  disabled,
  type = 'text',
  width = '100%',
  maxLength,
  autoFocus,
  tokens,
  onChange,
}: TextOptionProps) => {
  const [showAllTokens, setShowAllTokens] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const tokenRegExp = makeTokenRegExp(tokens)

  // use inert to ensure token selector gets hidden when comp is disabled
  const inert = disabled ? 'true' : undefined //  todo: update to boolean after this bug is fixed: https://github.com/facebook/react/pull/24730

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const rootClasses = classy(classes.TextOption, {
    [classes.disabled]: disabled,
  })

  return (
    <div
      className={rootClasses}
      inert={inert}
    >
      <div className={classes.label}>{sentenceCase(label)}</div>
      <div style={{ width }}>
        <input
          ref={inputRef}
          disabled={disabled}
          type={type}
          maxLength={maxLength}
          onInput={({ currentTarget }) => {
            onChange(currentTarget.value)
          }}
          value={value}
        />
        {tokens?.length && tokenRegExp ? (
          <div className={classes.tokenSelector}>
            <span className={classes.insert}>{`${sentenceCase(intl.insert())}:`}</span>
            {(showAllTokens ? tokens : tokens.slice(0, MAX_COLLAPSED_TOKENS)).map(
              ({ id, label, token }) => (
                <button
                  key={id}
                  className={classes.token}
                  onClick={() => {
                    // insert token at cursor position

                    const input = inputRef.current

                    if (!input || input.selectionStart == null || input.selectionEnd == null) return

                    input.focus()

                    const inputSelectionOverlapsToken = selectionOverlapsToken(
                      input.value,
                      input.selectionStart,
                      input.selectionEnd,
                      tokenRegExp,
                    )

                    // setting input value (via insertInputText()) below seems redundant since onChange will render the new value, but it's needed for cursor position update to work. setting an input value puts cursor at end of input unless value is same, so insertInputText() updates cursor position after setting the value and onChange will not disrupt this position since value will be same.; insertInputText() does not fire onInput

                    if (inputSelectionOverlapsToken === 'full') {
                      // replace token
                      onChange(insertInputText(input, token, 1))
                    } else if (!inputSelectionOverlapsToken) {
                      // insert token
                      onChange(insertInputText(input, `[${token}]`))
                    }
                  }}
                >
                  {label}
                </button>
              ),
            )}
            {tokens.length > MAX_COLLAPSED_TOKENS ? (
              <button
                className={classes.expandCollapse}
                onClick={() => setShowAllTokens((prev) => !prev)}
              >
                {showAllTokens ? '< less' : 'more >'}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
