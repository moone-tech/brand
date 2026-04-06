// client/src/modules/ci/useCiStore.ts
// Editable CI data — persisted in localStorage (immediate) + synced with API (background).

import { useState, useCallback, useEffect } from 'react'
import { VALUES, VOICE_EXAMPLES, type CiValue, type VoiceExample } from './data'
import { api } from '@/lib/api'

const KEY = 'moone-ci-v1'

export interface CiEditable {
  missionOne: string
  missionFull: string
  visionOne: string
  visionFull: string
  brandPromise: string
  posCustomer: string
  posMerchant: string
  posInvestor: string
  posRegulator: string
  category: string
  values: CiValue[]
  voice: VoiceExample[]
}

const DEFAULTS: CiEditable = {
  missionOne:   'Stavíme novou kategorii produktu — ekosystém, který platí zákazníkům za to, že s ním platí. PREMIUM pro každého.',
  missionFull:  'Mo.one obrací logiku platebního trhu. Místo toho, aby bral poplatky za každou transakci, odměňuje zákazníky Stardust body, cashbackem a přímými výhodami. Pomocí PSD2 licence a A2A infrastruktury odstraňujeme mezičlánky — a část ušetřeného vracíme zpátky zákazníkovi. Věříme, že prémiová platební zkušenost by neměla být výsadou bohatých.',
  visionOne:    'Stát se evropskou SuperApp, která z každého uživatele dělá premium hrdinu — bez ohledu na výši jeho příjmu.',
  visionFull:   'Do roku 2030 obsluhujeme 10 milionů uživatelů napříč EU. Mo.one je referenční příklad toho, jak SuperApp může obrátit platební ekosystém — místo výběru poplatků vytváří hodnotu pro každého účastníka. Zákazník platí a vydělává. Obchodník šetří a roste. Mo.one buduje infrastrukturu pro obě strany.',
  brandPromise: '"Mo.one ti platí za to, že platíš s námi."',
  posCustomer:  'Plať přímo z účtu, vydělávej Stardust body za každou transakci, užívej cashback a výhody. Vše v jedné aplikaci — bez poplatků za kartu, bez složité registrace. Mo.one je tvoje platební identita. A na rozdíl od ostatních ti za ni platí.',
  posMerchant:  'Přijímej A2A platby za zlomek ceny karetní transakce. Nula interchange. Okamžité vypořádání. Věrnostní program, loterie a marketing tools v ceně. Mo.one tě propojuje přímo se zákazníky — bez prostředníků.',
  posInvestor:  'Regulovaná fintech holding s PSD2 licencí (AIS+PIS), 3 scénáři DCF valuace (463–7 935 m Kč EV) a přicházejícím stablecoin layerem CZKT. CAC efektivně nula díky Legi.one Hunter síti. Unikátní flywheel: čím více zákazníků platí, tím více vydělávají — a tím méně odcházejí.',
  posRegulator: 'Plně licencovaný PSD2 poskytovatel AIS+PIS. DORA, NIS2, GDPR compliance. Transparentní holding struktura s jasnou governance. Stablecoin CZKT připravován pod regulací MiCA.',
  category:     'Mo.one není platební terminál, neo-banka ani jen věrnostní program. Je to první SuperApp Payment Ecosystem, který obrací logiku platebního trhu — zákazník platí a vydělává zároveň. Nová kategorie: PREMIUM pro každého. Jako WeChat Pay pro Evropu, ale s regulační legitimitou od prvního dne a reward systémem, který z každého uživatele dělá hrdinu.',
  values:       VALUES,
  voice:        VOICE_EXAMPLES,
}

function load(): CiEditable {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) as Partial<CiEditable> }
  } catch {
    return DEFAULTS
  }
}

export function useCiStore() {
  const [data, setData] = useState<CiEditable>(load)
  const [syncing, setSyncing] = useState(false)

  // Fetch remote data on mount — merge with local, remote wins on conflicts
  useEffect(() => {
    setSyncing(true)
    api.get<{ data: Partial<CiEditable> }>('/ci')
      .then((res) => {
        const remote = res.data.data
        if (remote && Object.keys(remote).length > 0) {
          setData((prev) => {
            const merged = { ...prev, ...remote }
            localStorage.setItem(KEY, JSON.stringify(merged))
            return merged
          })
        }
      })
      .catch(() => {/* offline — use localStorage */})
      .finally(() => setSyncing(false))
  }, [])

  const save = useCallback((patch: Partial<CiEditable>) => {
    setData((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem(KEY, JSON.stringify(next))
      // Fire-and-forget API sync
      api.put('/ci', next).catch(() => {})
      return next
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(KEY)
    setData(DEFAULTS)
    api.put('/ci', DEFAULTS).catch(() => {})
  }, [])

  return { data, save, reset, syncing }
}
