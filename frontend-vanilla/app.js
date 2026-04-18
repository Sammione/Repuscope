/**
 * RepuScope - Enterprise Reputation Intelligence
 * Main Application Logic (Clean Light Version - Fixed)
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
            const nameEl = document.querySelector('.user-name');
            const roleEl = document.querySelector('.user-role');
            if (nameEl) nameEl.innerText = user.email.split('@')[0];
            if (roleEl) roleEl.innerText = `Org: ${user.org_id.substring(0,8)}`;
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

function switchSection(sectionId) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeNav = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNav) activeNav.classList.add('active');
    
    document.querySelectorAll('.app-section').forEach(sec => {
        sec.classList.toggle('hidden', sec.id !== `section-${sectionId}`);
    });

    if (sectionId === 'dashboard') loadDashboardData();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    document.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.toggle('hidden', p.id !== `tab-${tabId}`);
    });
}

async function loadDashboardData() {
    const token = localStorage.getItem('repuscope_token');
    try {
        const response = await fetch(`${API_BASE_URL}/stats?token=${token}`);
        const stats = await response.json();
        
        const coverageEl = document.getElementById('kpi-coverage');
        const riskEl = document.getElementById('kpi-high-risk');
        const resEl = document.getElementById('kpi-resolution');
        
        if (coverageEl) coverageEl.innerText = stats.entities_monitored.toLocaleString();
        if (riskEl) riskEl.innerText = stats.high_risk_alerts;
        if (resEl) resEl.innerText = stats.avg_resolution_time;
        
        initDashboardCharts();
    } catch (err) {
        console.error('Failed to load dashboard stats', err);
    }
}

async function handleSearch(query) {
    if (!query) return;
    const token = localStorage.getItem('repuscope_token');
    const searchInput = document.getElementById('global-search');
    
    try {
        searchInput.disabled = true;
        searchInput.placeholder = "Searching database...";
        
        const response = await fetch(`${API_BASE_URL}/verify?rc_number=${query}&token=${token}`);
        if (!response.ok) throw new Error("Entity verification failed");
        
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

    const nameEl = document.getElementById('entity-name');
    const badgeEl = document.querySelector('.badge-tag.badge-verified');
    
    if (nameEl) nameEl.innerText = entity.company_name;
    if (badgeEl) badgeEl.innerText = `${rc} • CAC ${entity.status.toUpperCase()}`;
    
    fetchReputationData(rc, token);
    fetchESGData(rc, token);
    fetchCreditData(rc, token);
    fetchNewsData(entity.company_name, rc, token);
    fetchComplianceData(rc, token);
}

async function fetchReputationData(rc, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/reputation/${rc}?token=${token}`);
        const data = await response.json();
        
        const scoreCircle = document.querySelector('.score-box .score-circle');
        if (scoreCircle) {
            scoreCircle.innerText = Math.round(data.score);
        }
        
        const riskBadge = document.querySelector('.badge-tag.badge-risk-low') || document.querySelector('.badge-tag.badge-risk-medium') || document.querySelector('.badge-tag.badge-risk-high');
        if (riskBadge) {
            riskBadge.innerText = `RISK LEVEL: ${data.risk_level.toUpperCase()}`;
            riskBadge.className = `badge-tag badge-risk-${data.risk_level.toLowerCase()}`;
        }
    } catch (e) {}
}

async function fetchESGData(rc, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/esg/${rc}?token=${token}`);
        const data = await response.json();
        const esgPane = document.getElementById('tab-esg');
        if (esgPane) {
            esgPane.innerHTML = `<div class="card"><div class="card-content"><h3>ESG Maturity</h3><p>Level: <strong>${data.maturity_level}</strong></p><p>${data.summary}</p></div></div>`;
        }
    } catch (e) {}
}

async function fetchNewsData(name, rc, token) {
    try {
        const feed = document.getElementById('entity-news-feed');
        if (!feed) return;
        feed.innerHTML = '<p>Scanning news...</p>';
        const response = await fetch(`${API_BASE_URL}/intelligence/${encodeURIComponent(name)}?rc_number=${rc}&token=${token}`);
        const articles = await response.json();
        
        if (articles.length === 0) {
            feed.innerHTML = '<p>No news signals found.</p>';
            return;
        }

        feed.innerHTML = articles.map(art => `
            <div style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                <p><strong>${art.sentiment}</strong>: <a href="${art.url}" target="_blank">${art.title}</a></p>
                <small>${art.source} • ${new Date(art.published_at).toLocaleDateString()}</small>
            </div>
        `).join('');
    } catch (e) {}
}

async function fetchCreditData(rc, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/credit-risk/${rc}?token=${token}`);
        const data = await response.json();
        const creditPane = document.getElementById('tab-credit');
        if (creditPane) {
            creditPane.innerHTML = `<div class="card"><h3>Credit Profile</h3><p>Grade: ${data.grade}</p><p>PD: ${(data.probability_of_default * 100).toFixed(2)}%</p></div>`;
        }
    } catch (e) {}
}

async function fetchComplianceData(rc, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/compliance/${rc}?token=${token}`);
        const records = await response.json();
        const pane = document.getElementById('tab-compliance');
        if (pane) {
            pane.innerHTML = records.map(r => `<div>${r.agency}: ${r.status}</div>`).join('');
        }
    } catch (e) {}
}

/** Charts (Simplified for Reversion) **/
const charts = {};
function renderChart(id, type, data, options = {}) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(ctx, { type, data, options: { responsive: true, ...options } });
}

function initDashboardCharts() {
    renderChart('reputationTrendChart', 'line', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{ label: 'Reputation', data: [70, 75, 72, 78], borderColor: '#2563eb' }]
    });
    renderChart('complianceHeatmapChart', 'bar', {
        labels: ['CAC', 'FIRS', 'SEC'],
        datasets: [{ label: 'Score', data: [80, 90, 60], backgroundColor: '#22c55e' }]
    });
}

/** Auth **/
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Login failed');
        localStorage.setItem('repuscope_token', data.access_token);
        window.location.reload();
    } catch (err) { alert(err.message); }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const org_name = document.getElementById('reg-org').value;
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, org_name })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Registration failed');
        alert('Created! Please login.');
        document.getElementById('auth-toggle-btn').click();
    } catch (err) { alert(err.message); }
}
