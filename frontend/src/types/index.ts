export interface User {
  id: string;
  email: string;
  org_id: string;
  role: string;
}

export interface DashboardStats {
  entities_monitored: number;
  high_risk_alerts: number;
  avg_resolution_time: string;
}

export interface Entity {
  rc_number: string;
  company_name: string;
  status: string;
  registered_address: string;
  directors: string[];
}

export interface ReputationData {
  rc_number: string;
  score: number;
  sentiment_polarity: number;
  compliance_subscore: number;
  risk_level: string;
}

export interface ESGAssessment {
  environmental: number;
  social: number;
  governance: number;
  maturity_level: string;
  summary: string;
}

export interface CreditRisk {
  grade: string;
  probability_of_default: number;
  debt_pressure: string;
  outlook: string;
}

export interface NewsArticle {
  source: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface ComplianceRecord {
  agency: string;
  status: string;
  last_verified: string | null;
}
