import { FormatId } from '@/format'
import { ConfiguredFormat } from '@/configured-format'
import { intl } from '@/intl'

export async function copyTabs(tabs: chrome.tabs.Tab[], format: ConfiguredFormat<FormatId>) {
  // throw new Error('test')
  console.log(`copying ${tabs.length} ${intl.tab(tabs.length)} as "${format.label}"`)

  // todo: replace with formatted copy implementation
  await navigator.clipboard.writeText(JSON.stringify(tabs.map(({ title }) => title)))
}
