from .database import get_supabase_client
from typing import Dict

supabase = get_supabase_client()

class ESGService:
    @staticmethod
    def calculate_maturity(e: float, s: float, g: float) -> str:
        avg = (e + s + g) / 3
        if avg >= 4.5: return "Leader"
        if avg >= 3.5: return "Advanced"
        if avg >= 2.0: return "Developing"
        return "Emerging"

    @staticmethod
    async def get_assessment(rc_number: str) -> Dict:
        """
        Fetches ESG data from Supabase and calculates maturity.
        """
        response = supabase.table("esg_metrics").select("*").eq("rc_number", rc_number).execute()
        
        if not response.data:
            # Empty state indicating no assessment data exists in the database
            return {
                "environmental": 0.0,
                "social": 0.0,
                "governance": 0.0,
                "maturity_level": "Unassessed",
                "summary": "No ESG data available in the current tenant database."
            }

        data = response.data[0]
        maturity = ESGService.calculate_maturity(
            float(data["environmental_score"]), 
            float(data["social_score"]), 
            float(data["governance_score"])
        )
        
        return {
            "environmental": float(data["environmental_score"]),
            "social": float(data["social_score"]),
            "governance": float(data["governance_score"]),
            "maturity_level": maturity,
            "summary": f"Entity demonstrates {maturity.lower()} maturity in ESG disclosures."
        }
