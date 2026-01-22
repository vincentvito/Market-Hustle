'use client'

import { ASSETS } from '@/lib/game/assets'
import { AssetRow } from './AssetRow'

export function AssetList() {
  return (
    <div>
      {ASSETS.map(asset => (
        <AssetRow key={asset.id} asset={asset} />
      ))}
    </div>
  )
}
