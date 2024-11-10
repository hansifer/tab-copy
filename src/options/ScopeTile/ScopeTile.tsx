import { MIN_VISIBLE_SCOPE_COUNT, Scope, ScopeId } from '@/scope'
import { toggleVisibleScopeId } from '@/storage'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

import { Tile } from '../Tile/Tile'

type ScopeTileProps = {
  scope: Scope
  visibleScopes: Scope[]
}

export const ScopeTile = ({
  // wrap
  scope,
  visibleScopes,
}: ScopeTileProps) => {
  const visible = visibleScopes.some(({ id }) => id === scope.id)
  const isMinVisibleScopeCount = visibleScopes.length <= MIN_VISIBLE_SCOPE_COUNT
  const defaultScope = visibleScopes[0]

  return (
    <Tile<ScopeId>
      id={scope.id}
      label={sentenceCase(scope.label())}
      description={
        visible
          ? defaultScope && defaultScope.id === scope.id
            ? sentenceCase(intl.default())
            : ''
          : sentenceCase(intl.hidden())
      }
      tip={sentenceCase('description' in scope ? scope.description() : '')}
      checked={visible}
      disabled={visible && isMinVisibleScopeCount}
      onClick={toggleVisibleScopeId}
    />
  )
}
