type FieldValue = string | number | null
type Row = FieldValue[]

type CSVModel = {
  fields?: Row // ie, header row
  records?: Row[]
  error?: string
}

const QUOTE_CHAR = '"'
const DELIMITER = ','
const NEWLINE = /\r?\n/g

const rxIsInt = /^-?\d+$/
const rxIsFloat = /^-?\d*\.\d+$|^\d+\.\d*$/

// If a string has leading or trailing space,
// or contains a comma, double quote, or a newline
// it needs to be quoted in CSV output
const rxNeedsQuoting = /^\s|\s$|,|"|\n/

// assumes header row exists
export const CSVError = 'CSVError'
export const noRowsCSVError = 'noRowsCSVError'
export const CSVNoDataError = 'CSVNoDataError'
export const badHeaderError = 'badHeaderError'

export const parseCSV = (csv: string): CSVModel => {
  if (!csv.replace(/\s+/g, '').replace(NEWLINE, '').length) {
    return { error: CSVNoDataError }
  } else {
    try {
      const parsedCSV = parse(csv)
      const records = parsedCSV.slice(1)
      if (!records.length) {
        return { error: noRowsCSVError }
      }
      const fields = parsedCSV[0]
      const goodHeader = fields.every((header) => typeof header === 'string')
      if (!goodHeader) {
        return { error: badHeaderError }
      }
      return {
        fields,
        records,
      }
    } catch (err) {
      return { error: CSVError }
    }
  }
}

export const stringifyCSV = (csvModel: CSVModel) => {
  return stringifyCSVRows([
    ...(csvModel.fields ? [csvModel.fields] : []),
    ...(csvModel.records ?? []),
  ])
}

// 2022-02-02 below code is adapted from https://github.com/okfn/csv.js

// Copyright (c) 2011-2013 Open Knowledge Foundation

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export const parse = (input: string): Row[] => {
  input = input.replace(NEWLINE, '\n').trim()

  let currentChar = ''
  let currentField: FieldValue = ''
  let currentRow: Row = []
  let inQuote = false
  let fieldQuoted = false
  const output: Row[] = []

  for (let i = 0; i < input.length; i++) {
    currentChar = input.charAt(i)

    if (inQuote === false && (currentChar === DELIMITER || currentChar === '\n')) {
      // at end of a field
      currentRow.push(normalizeField(currentField, fieldQuoted))

      if (currentChar === '\n') {
        output.push(currentRow)
        currentRow = []
      }

      currentField = ''
      fieldQuoted = false
    } else {
      // inside of a field
      if (currentChar === QUOTE_CHAR) {
        if (inQuote) {
          // next char is QUOTE_CHAR, this is an escaped QUOTE_CHAR
          if (input.charAt(i + 1) === QUOTE_CHAR) {
            currentField += QUOTE_CHAR
            // skip next char
            i++
          } else {
            // not escaping. end quote.
            inQuote = false
          }
        } else {
          // not in a quote, start a quote
          inQuote = true
          fieldQuoted = true
        }
      } else {
        // not a QUOTE_CHAR. add to field buffer.
        currentField += currentChar
      }
    }
  }

  // add last field
  currentField = normalizeField(currentField, fieldQuoted)
  currentRow.push(currentField)
  output.push(currentRow)

  return output

  function normalizeField(field: string, fieldQuoted: boolean): FieldValue {
    if (!fieldQuoted) {
      // if field is empty set to null
      if (field === '') return null

      // convert unquoted numbers to appropriate types
      if (rxIsInt.test(field)) return parseInt(field, 10)
      if (rxIsFloat.test(field)) return parseFloat(field)
    }

    return field
  }
}

export const stringifyCSVRows = (rows: Row[]) => rows.map((row) => stringifyCSVRow(row)).join('\n')

export const stringifyCSVRow = (row: Row) =>
  row.map((val) => stringifyFieldValue(val)).join(DELIMITER)

function stringifyFieldValue(fieldValue: FieldValue): string {
  if (fieldValue == null) {
    return ''
  }

  if (typeof fieldValue === 'string' && rxNeedsQuoting.test(fieldValue)) {
    return `"${fieldValue.replace(/"/g, '""')}"`
  }

  if (typeof fieldValue === 'number') {
    return fieldValue.toString(10)
  }

  return fieldValue
}
