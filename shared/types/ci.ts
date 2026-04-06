// =============================================================================
// shared/types/ci.ts — Corporate Identity types
// =============================================================================

/** Editable brand core fields (stored in ci_settings as JSONB) */
export interface CiEditable {
  missionOne: string;
  missionFull: string;
  visionOne: string;
  visionFull: string;
  brandPromise: string;
  positioningCustomers: string;
  positioningMerchants: string;
  positioningInvestors: string;
  positioningRegulators: string;
  positioningCategory: string;
  category: string;
  values: CiValueEditable[];
}

export interface CiValueEditable {
  id: string;
  title: string;
  description: string;
}
