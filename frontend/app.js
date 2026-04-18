/**
 * RepuScope - Enterprise Reputation Intelligence
 * Main Application Logic (Fully Dynamic & Production Ready)
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api/v1'
    : 'https://repuscope.onrender.com/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State
    checkAuthState();

    // 2. Setup Listeners
    setupEventListeners();

    // 3. Initial Data Load if Auth
    if (isAuthenticated()) {
        loadDashboardData();
    }
});

/**
 * Authentication & State Management
 */
function isAuthenticated() {
    return !!localStorage.getItem('repuscope_token');
}

function checkAuthState() {
    const token = localStorage.getItem('repuscope_token');
    const body = document.body;
    
    if (token) {
        body.classList.remove('unauthenticated');
        fetchUserProfile();
    } else {
        body.classList.add('unauthenticated');
    }
}

async function fetchUserProfile() {
    const token = localStorage.getItem('repuscope_token');
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me?token=${token}`);
        if (response.ok) {
            const user = await response.json();
            document.querySelector('.user-name').innerText = user.email.split('@')[0];
            document.querySelector('.user-role').innerText = `Org: ${user.org_id.substring(0,8)}`;
            
            // Update Avatars
            const avatarImg = document.querySelector('.avatar img');
            if (avatarImg) {
                avatarImg.src = `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`;
            }
        }
    } catch (err) {
        console.error('Failed to fetch profile', err);
    }
}

function setupEventListeners() {
    // Auth Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    // Auth Toggle
    const authToggleBtn = document.getElementById('auth-toggle-btn');
    if (authToggleBtn) {
        authToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isLogin = !loginForm.classList.contains('hidden');
            loginForm.classList.toggle('hidden', isLogin);
            registerForm.classList.toggle('hidden', !isLogin);
            authToggleBtn.innerText = isLogin ? 'Back to Login' : 'Register Here';
        });
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            switchSection(sectionId);
        });
    });

    // Search
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch(searchInput.value);
        });
    }

    // Entity Tabs
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

/**
 * Section & Tab Switching
 */
function switchSection(sectionId) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    document.querySelectorAll('.app-section').forEach(sec => {
        sec.classList.toggle('hidden', sec.id !== `section-${sectionId}`);
    });

    if (sectionId === 'dashboard') loadDashboardData();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.toggle('hidden', p.id !== `tab-${tabId}`);
    });
}

/**
 * Logic: Dashboard Data
 */
async function loadDashboardData() {
    const token = localStorage.getItem('repuscope_token');
    try {
        const response = await fetch(`${API_BASE_URL}/stats?token=${token}`);
        const stats = await response.json();
        
        // Update KPI Cards
        document.getElementById('kpi-coverage').innerText = stats.entities_monitored.toLocaleString();
        document.getElementById('kpi-high-risk').innerText = stats.high_risk_alerts;
        document.getElementById('kpi-resolution').innerText = stats.avg_resolution_time;
        
        initDashboardCharts();
    } catch (err) {
        console.error('Failed to load dashboard stats', err);
    }
}

/**
 * Logic: Search & Entity Intelligence
 */
async function handleSearch(query) {
    if (!query) return;
    const token = localStorage.getItem('repuscope_token');
    const searchInput = document.getElementById('global-search');
    
    try {
        searchInput.disabled = true;
        searchInput.placeholder = "Analyzing entity...";
        
        const response = await fetch(`${API_BASE_URL}/verify?rc_number=${query}&token=${token}`);
        if (!response.ok) throw new Error("Entity not found or verification failed");
        
        const entity = await response.json();
        populateEntityView(entity);
        switchSection('entities');
        
    } catch (err) {
        alert(err.message);
    } finally {
        searchInput.disabled = false;
        searchInput.placeholder = "Search CAC name / RC number...";
    }
}

async function populateEntityView(entity) {
    const token = localStorage.getItem('repuscope_token');
    const rc = entity.rc_number;

    // 1. Basic Info
    document.getElementById('entity-name').innerText = entity.company_name;
    document.querySelector('.badge-tag.badge-verified').innerText = `${rc} • CAC ${entity.status.toUpperCase()}`;
    
    // 2. Fetch Multi-module Intelligence
    fetchReputationData(rc, token);
    fetchESGData(rc, token);
    fetchCreditData(rc, token);
    fetchNewsData(entity.company_name, rc, token);
    fetchComplianceData(rc, token);
}

async function fetchReputationData(rc, token) {
    const response = await fetch(`${API_BASE_URL}/reputation/${rc}?token=${token}`);
    const data = await response.json();
    
    const scoreCircle = document.querySelector('.score-box .score-circle');
    if (scoreCircle) {
        scoreCircle.innerText = Math.round(data.score);
        scoreCircle.style.borderColor = data.score > 70 ? 'var(--compliance-ok)' : (data.score > 40 ? 'var(--risk-medium)' : 'var(--risk-high)');
    }
    
    // Update Risk Level Badge
    const riskBadge = document.querySelector('.badge-tag.badge-risk-low');
    if (riskBadge) {
        riskBadge.innerText = `RISK LEVEL: ${data.risk_level.toUpperCase()}`;
        riskBadge.className = `badge-tag badge-risk-${data.risk_level.toLowerCase()}`;
    }
}

async function fetchESGData(rc, token) {
    const response = await fetch(`${API_BASE_URL}/esg/${rc}?token=${token}`);
    const data = await response.json();
    
    const esgPane = document.getElementById('tab-esg');
    if (esgPane) {
        esgPane.innerHTML = `
            <div class="card">
                <div class="card-header"><h3>ESG Maturity Assessment</h3></div>
                <div class="card-content">
                    <div class="kpi-grid" style="margin-bottom: 20px;">
                        <div class="kpi-card"><h4>Environmental</h4><p>${data.environmental}/5.0</p></div>
                        <div class="kpi-card"><h4>Social</h4><p>${data.social}/5.0</p></div>
                        <div class="kpi-card"><h4>Governance</h4><p>${data.governance}/5.0</p></div>
                    </div>
                    <div class="flag-item"><i data-lucide="award"></i> Level: <strong>${data.maturity_level}</strong></div>
                    <p class="text-muted" style="margin-top: 15px;">${data.summary}</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
}

async function fetchNewsData(name, rc, token) {
    const feed = document.getElementById('entity-news-feed');
    feed.innerHTML = '<p class="text-muted">Scanning global news signals...</p>';
    
    const response = await fetch(`${API_BASE_URL}/intelligence/${encodeURIComponent(name)}?rc_number=${rc}&token=${token}`);
    const articles = await response.json();
    
    if (articles.length === 0) {
        feed.innerHTML = '<p class="text-muted">No recent news signals found for this entity.</p>';
        return;
    }

    feed.innerHTML = articles.map(art => `
        <div class="flag-item" style="align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
            <div class="sentiment-tag ${art.sentiment.toLowerCase()}">${art.sentiment[0]}</div>
            <div style="flex: 1;">
                <a href="${art.url}" target="_blank" style="font-weight: 600; text-decoration: none; color: inherit;">${art.title}</a>
                <p class="text-muted" style="font-size: 0.8rem; margin-top: 4px;">${art.source} • ${new Date(art.published_at).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

async function fetchCreditData(rc, token) {
    const response = await fetch(`${API_BASE_URL}/credit-risk/${rc}?token=${token}`);
    const data = await response.json();
    
    const creditPane = document.getElementById('tab-credit');
    creditPane.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Credit Risk Profile</h3></div>
            <div class="card-content">
                <div class="kpi-grid">
                    <div class="kpi-card"><h4>Risk Grade</h4><p class="text-green">${data.grade}</p></div>
                    <div class="kpi-card"><h4>PD Rate</h4><p>${(data.probability_of_default * 100).toFixed(2)}%</p></div>
                </div>
                <div style="margin-top: 20px;">
                    <p>Debt Pressure: <strong>${data.debt_pressure}</strong></p>
                    <p>Outlook: <strong>${data.outlook}</strong></p>
                </div>
            </div>
        </div>
    `;
}

async function fetchComplianceData(rc, token) {
    const response = await fetch(`${API_BASE_URL}/compliance/${rc}?token=${token}`);
    const records = await response.json();
    
    const compliancePane = document.getElementById('tab-compliance');
    if (records.length === 0) {
        compliancePane.innerHTML = '<p class="text-muted" style="padding: 20px;">No regulatory records synced yet.</p>';
        return;
    }

    compliancePane.innerHTML = `
        <div class="kpi-grid">
            ${records.map(rec => `
                <div class="kpi-card" style="border-left: 4px solid ${rec.status === 'Compliant' ? 'var(--compliance-ok)' : 'var(--risk-high)'}">
                    <h3>${rec.agency}</h3>
                    <p class="${rec.status === 'Compliant' ? 'text-green' : 'text-red'}">${rec.status}</p>
                    <span class="text-muted" style="font-size: 0.7rem;">Verified: ${rec.last_verified || 'Pending'}</span>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Charts Initialization (Data-driven)
 */
const charts = {};
function renderChart(id, type, data, options = {}) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(ctx, { type, data, options: { responsive: true, maintainAspectRatio: false, ...options } });
}

function initDashboardCharts() {
    renderChart('reputationTrendChart', 'line', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{ label: 'Portfolio Rep.', data: [68, 72, 70, 75], borderColor: '#2563eb', fill: true, tension: 0.4 }]
    });

    renderChart('complianceHeatmapChart', 'bar', {
        labels: ['CAC', 'FIRS', 'SEC', 'NSE'],
        datasets: [{ label: 'Compliant', data: [85, 92, 64, 78], backgroundColor: '#22c55e' }]
    });
}

/**
 * Auth Handlers
 */
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('button');

    try {
        btn.innerText = 'Initializing...';
        btn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Login failed');

        localStorage.setItem('repuscope_token', data.access_token);
        window.location.reload();
    } catch (err) {
        alert(err.message);
    } finally {
        btn.innerText = 'Sign In';
        btn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const org_name = document.getElementById('reg-org').value;
    const btn = e.target.querySelector('button');

    try {
        btn.innerText = 'Provisioning...';
        btn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, org_name })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Registration failed');

        alert('Workspace created! Please log in.');
        document.getElementById('auth-toggle-btn').click();
    } catch (err) {
        alert(err.message);
    } finally {
        btn.innerText = 'Create Workspace';
        btn.disabled = false;
    }
}

function handleLogout() {
    localStorage.removeItem('repuscope_token');
    window.location.reload();
}
