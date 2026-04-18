from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel, Field
import uvicorn
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
# Import services using absolute paths from the project root
from backend.news_service import NewsService
from backend.database import get_supabase_client
from backend.esg_service import ESGService
from backend.auth_utils import get_password_hash, verify_password, create_access_token, decode_access_token
from data_pipeline.scraper import RegulatoryScraper

from fastapi.security import OAuth2PasswordBearer
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

news_service = NewsService()
supabase = get_supabase_client()
esg_service = ESGService()
scraper = RegulatoryScraper()

# Configure Enterprise-grade Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("RepuScope-API")

app = FastAPI(
    title="RepuScope Intelligence API",
    description="Enterprise API for Reputation Monitoring, Compliance Tracking, and ESG Analytics.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS Configuration for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---

class CompanyVerification(BaseModel):
    rc_number: str = Field(..., example="RC1234567")
    company_name: str
    status: str = "Active"
    registered_address: Optional[str] = None
    directors: List[str] = Field(default_factory=list)

class ComplianceRecord(BaseModel):
    agency: str
    status: str
    last_verified: Optional[str]

class ESGAssessment(BaseModel):
    environmental: float
    social: float
    governance: float
    maturity_level: str
    summary: str

class CreditRiskProfile(BaseModel):
    grade: str
    probability_of_default: float
    debt_pressure: str
    outlook: str

class ReputationScore(BaseModel):
    rc_number: str
    score: float
    sentiment_polarity: float
    compliance_subscore: float
    risk_level: str

class IntelligenceArticle(BaseModel):
    source: str
    title: str
    description: Optional[str]
    url: str
    published_at: Optional[str]
    sentiment: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    org_name: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfile(BaseModel):
    id: str
    email: str
    org_id: str
    role: str

# --- Core Application Routes ---

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "operational", "version": "1.0.0", "service": "RepuScope Core Intelligence"}

# --- Authentication & User Management ---

@app.post("/api/v1/auth/register", tags=["Authentication"])
async def register(user: UserRegister):
    try:
        # 1. Create Organization
        org_id = str(uuid.uuid4())
        org_data = {"id": org_id, "name": user.org_name}
        supabase.table("organizations").insert(org_data).execute()
        
        # 2. Create User
        user_id = str(uuid.uuid4())
        hashed_pw = get_password_hash(user.password)
        user_data = {
            "id": user_id, 
            "email": user.email, 
            "hashed_password": hashed_pw, 
            "org_id": org_id,
            "role": "admin"
        }
        supabase.table("users").insert(user_data).execute()
        
        return {"message": "User and Organization created successfully", "org_id": org_id}
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/v1/auth/login", response_model=Token, tags=["Authentication"])
async def login(user: UserLogin):
    try:
        response = supabase.table("users").select("*").eq("email", user.email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        db_user = response.data[0]
        if not verify_password(user.password, db_user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token(data={"sub": db_user["email"], "org_id": db_user["org_id"]})
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

# Dependency for protected routes
async def get_current_user(token: str = Query(...)): # Switching Query for simplicity in this demo, normally OAuth2PasswordBearer
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

@app.get("/api/v1/auth/me", response_model=UserProfile, tags=["Authentication"])
async def get_me(user: dict = Depends(get_current_user)):
    response = supabase.table("users").select("*").eq("email", user["sub"]).execute()
    return response.data[0]

# --- Protected Routes with Multi-tenancy ---

@app.get("/api/v1/verify", response_model=CompanyVerification, tags=["Entity Management"])
async def verify_company(query: str = Query(..., min_length=2), user: dict = Depends(get_current_user)):
    org_id = user["org_id"]
    
    logger.info(f"Verifying entity: {query} for Org: {org_id}")
    
    # Intelligently check if user searched by RC Number or Company Name
    is_rc_number = query.upper().startswith("RC")
    
    # Filter by Org ID for true multi-tenancy
    query_col = "rc_number" if is_rc_number else "company_name"
    response = supabase.table("entities") \
        .select("*") \
        .ilike(query_col, f"%{query}%") \
        .eq("org_id", org_id) \
        .execute()
    
    if response.data:
        entity = response.data[0]
    else:
        # Trigger Cold Start Scrape
        logger.info(f"New entity detected. Scraping records for {query}...")
        scrape_result = await scraper.fetch_compliance_status(query, "CAC")
        
        # Save new entity to DB securely binding the tenant Org ID
        generated_rc = query if is_rc_number else f"RC-PENDING-{str(uuid.uuid4())[:6].upper()}"
        resolved_name = f"New Entity ({query})" if is_rc_number else query.title()
        
        new_entity = {
            "rc_number": generated_rc,
            "company_name": resolved_name, 
            "status": "Active" if scrape_result.get("is_compliant") else "Pending Verification",
            "registered_address": "Pending detailed CAC extraction",
            "org_id": org_id # CRITICAL FIX: required for insert success
        }
        supabase.table("entities").insert(new_entity).execute()
        entity = new_entity

    return {
        "rc_number": entity["rc_number"],
        "company_name": entity["company_name"],
        "status": entity["status"],
        "registered_address": entity["registered_address"],
        "directors": ["Awaiting Board Verification"]
    }

@app.get("/api/v1/stats", tags=["Dashboard"])
async def get_dashboard_stats():
    """Returns aggregate portfolio statistics for the dashboard."""
    try:
        entities_count = supabase.table("entities").select("rc_number", count="exact").execute()
        risk_count = supabase.table("reputation_scores").select("*").lt("score", 50).execute()
        
        return {
            "entities_monitored": entities_count.count or 0,
            "high_risk_alerts": len(risk_count.data) if risk_count.data else 0,
            "avg_resolution_time": "No Data" 
        }
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        return {"entities_monitored": 0, "high_risk_alerts": 0, "avg_resolution_time": "N/A"}

@app.get("/api/v1/compliance/{rc_number}", response_model=List[ComplianceRecord], tags=["Compliance"])
async def get_compliance(rc_number: str):
    """Fetches compliance records from Supabase."""
    response = supabase.table("compliance_records").select("*").eq("rc_number", rc_number).execute()
    return response.data

@app.get("/api/v1/reputation/{rc_number}", response_model=ReputationScore, tags=["Intelligence"])
async def get_reputation_score(rc_number: str):
    """Retrieves the reputation score from Supabase."""
    response = supabase.table("reputation_scores").select("*").eq("rc_number", rc_number).execute()
    if not response.data:
        # Empty state for new entities before async processing finishes
        return {
            "rc_number": rc_number,
            "score": 0.0,
            "sentiment_polarity": 0.0,
            "compliance_subscore": 0.0,
            "risk_level": "Unassessed"
        }
    return response.data[0]

@app.get("/api/v1/esg/{rc_number}", response_model=ESGAssessment, tags=["ESG"])
async def get_esg_maturity(rc_number: str):
    """Calculates and returns the ESG maturity for a company."""
    logger.info(f"Assessing ESG for: {rc_number}")
    assessment = await esg_service.get_assessment(rc_number)
    return assessment

@app.get("/api/v1/credit-risk/{rc_number}", response_model=CreditRiskProfile, tags=["Risk"])
async def get_credit_risk(rc_number: str):
    """Fetches credit risk profile from Supabase."""
    response = supabase.table("credit_risk").select("*").eq("rc_number", rc_number).execute()
    if not response.data:
        return {
            "grade": "N/A", 
            "probability_of_default": 0.0, 
            "debt_pressure": "No Data", 
            "outlook": "No Data"
        }
    return response.data[0]

@app.get("/api/v1/intelligence/{company_name}", response_model=List[IntelligenceArticle], tags=["Intelligence"])
async def get_company_intelligence(company_name: str, rc_number: Optional[str] = None):
    """
    Fetches news. Checks Supabase cache first to save API costs.
    """
    if rc_number:
        # Check cache (last 24 hours)
        cache = supabase.table("intelligence_feed") \
            .select("*") \
            .eq("rc_number", rc_number) \
            .execute()
        
        if cache.data and len(cache.data) > 0:
            logger.info(f"Serving cached intelligence for {rc_number}")
            return cache.data

    # Else fetch new
    logger.info(f"Fetching fresh intelligence for: {company_name}")
    articles = await news_service.fetch_company_news(company_name)
    
    # Save to cache if rc_number is provided
    if rc_number and articles:
        for art in articles:
            art_data = {**art, "rc_number": rc_number}
            supabase.table("intelligence_feed").insert(art_data).execute()
            
    return articles

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
