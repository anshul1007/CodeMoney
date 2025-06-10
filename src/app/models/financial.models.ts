export interface AssetItem {
  id: string;
  name: string;
  amount: number;
  category: 'current' | 'fixed';
}

export interface LiabilityItem {
  id: string;
  name: string;
  amount: number;
  category: 'current' | 'long-term';
}

export interface EquityItem {
  id: string;
  name: string;
  amount: number;
}

export interface BalanceSheetData {
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  equity: EquityItem[];
}

export interface FundingSource {
  id: string;
  name: string;
  icon: string;
  description: string;
  maxAmount?: number;
  interestRate?: number;
  isSelected?: boolean;
  amount?: number;
}
