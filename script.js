// Pre-available goal templates for instant startup
const TEMPLATE_GOALS = [
    {
        id: 1,
        title: "Master JavaScript",
        category: "Education",
        completed: 15,
        total: 20
    },
    {
        id: 2,
        title: "Run a Marathon",
        category: "Fitness",
        completed: 10,
        total: 25
    },
    {
        id: 3,
        title: "Launch Ad-Mon Suite",
        category: "Business",
        completed: 24,
        total: 25
    }
];

// Active tracked goals (starts empty so user can select presets or create new ones)
const goals = [];

const PRODUCTIVITY_CAMPAIGNS = [
    {
        title: 'ClockWise: Time-Blocking App',
        desc: 'The #1 time-blocking tool for high performers. Get 20% off with code GOALPRO.',
        promo: 'CODE "GOALPRO" FOR 20% OFF',
        img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'CPM Certification Course',
        desc: 'Become a certified project manager in 6 weeks. 98% pass rate. Enrollment open.',
        promo: 'CLAIM優先CODE: CPM6WEEKS',
        img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'FocusFlow Leather Journal',
        desc: 'Hardcover tactical daily planners to track habits and maintain peak states offline.',
        promo: 'GET 15% OFF PLANNERS: FOCUSFLOW',
        img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Creative Design Suite Pro',
        desc: 'Acquire 1,500+ design vector assets, vector grids, and Figma workflow systems.',
        promo: 'CLAIM 30% DISCOUNT: CREATIVE99',
        img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Billionaire Goal-Setting Seminar',
        desc: 'Unlock the scientific goal setting framework used by world-class tech founders.',
        promo: 'FREE RESERVED ACCESS: FOUNDERGOAL',
        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'ZenFocus Ambient Tracks',
        desc: 'Increase cognitive focus states with scientific binaural audio patterns.',
        promo: '7-DAY TRIAL ACCESS: BINAURALSTATE',
        img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&h=200&q=80'
    }
];

let adsDisabled = false;
let interactionCount = 0;

// --- 1. Dynamic Goals Grid Rendering ---
function renderGoals() {
    const grid = document.getElementById('goal-grid-feed');
    if (!grid) return;

    grid.innerHTML = '';
    
    // Beautiful dynamic empty state if no active tracked goals
    if (goals.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.style.cssText = `
            grid-column: 1 / -1;
            background: var(--card);
            border: 1px dashed var(--border);
            padding: 4rem 2rem;
            border-radius: 24px;
            text-align: center;
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        emptyState.innerHTML = `
            <div style="font-size: 3.5rem; margin-bottom: 1.2rem; animation: pulse 2s infinite;">✨</div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text); margin-bottom: 0.6rem;">No active goal streams running yet</h3>
            <p style="font-size: 0.85rem; color: var(--muted); max-width: 480px; margin: 0 auto 1.8rem auto; line-height: 1.6; font-weight: 500;">
                Click "Launch Goal" on any of the pre-available templates above, or click "+ New Goal" at the top right to start tracking custom milestones!
            </p>
        `;
        grid.appendChild(emptyState);
        return;
    }

    goals.forEach((goal, index) => {
        const pct = Math.round((goal.completed / goal.total) * 100);
        
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.onclick = () => {
            showSessionInterstitialAd(() => {
                openDetail(goal, index);
            });
        };
        card.innerHTML = `
            <div class="card-header">
                <h3>${goal.title}</h3>
                <span class="category">${goal.category}</span>
            </div>
            <div class="progress-section">
                <div class="progress-bar"><div class="fill" style="width: 0%"></div></div>
                <span class="percentage">${pct}%</span>
            </div>
            <p>${goal.completed} of ${goal.total} tasks completed</p>
        `;
        grid.appendChild(card);
        
        // Trigger width transitions
        setTimeout(() => {
            const fill = card.querySelector('.fill');
            if (fill) fill.style.width = `${pct}%`;
        }, 100);

        // Native sponsored in-feed ad banner placing every 3 items
        if ((index + 1) % 3 === 0) {
            const campaignIndex = Math.floor(index / 3) % PRODUCTIVITY_CAMPAIGNS.length;
            const campaign = PRODUCTIVITY_CAMPAIGNS[campaignIndex];
            
            const adCard = document.createElement('div');
            adCard.className = 'goal-card ad-exp';
            adCard.innerHTML = `
                <div class="card-header" style="margin-bottom:1rem;">
                    <span style="font-size:0.6rem; font-weight:900; color:var(--primary); letter-spacing:1px; text-transform:uppercase;">SPONSORED GOAL PARTNER</span>
                    <span class="category" style="background:#f3ebff;">Productivity</span>
                </div>
                <h3 style="font-size:1.1rem; font-weight:800; color:var(--text); margin-bottom:0.5rem;">${campaign.title}</h3>
                <p style="font-size:0.8rem; color:var(--muted); line-height:1.4; margin-bottom:1.5rem;">${campaign.desc}</p>
                <button class="ad-btn" style="width:100%" onclick="event.stopPropagation(); alert('🎉 Redirecting to partner dashboard!')">Claim Resource</button>
            `;
            grid.appendChild(adCard);
        }
    });
}

// Render pre-available template shelf
function renderPresets() {
    const container = document.getElementById('preset-goals-container');
    if (!container) return;

    container.innerHTML = '';
    TEMPLATE_GOALS.forEach((tpl) => {
        const isStarted = goals.some(g => g.title === tpl.title);
        
        const card = document.createElement('div');
        card.className = 'preset-card';
        card.style.cssText = `
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 1.2rem;
            transition: all 0.25s ease;
            ${isStarted ? 'opacity: 0.65; pointer-events: none;' : ''}
        `;
        
        card.innerHTML = `
            <div>
                <span class="category" style="margin-bottom: 0.8rem; display: inline-block;">${tpl.category}</span>
                <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text); line-height: 1.4; letter-spacing: -0.2px;">${tpl.title}</h3>
                <p style="font-size: 0.78rem; color: var(--muted); margin-top: 0.4rem; font-weight: 600;">Preset Milestones: ${tpl.total}</p>
            </div>
            <button class="ad-btn" style="width: 100%; padding: 0.65rem; font-size: 0.8rem; border-radius: 50px; background: ${isStarted ? '#a4b0be' : 'var(--primary)'}; border-color: ${isStarted ? '#a4b0be' : 'var(--primary)'}; cursor: pointer; text-transform: none; letter-spacing: 0;" onclick="event.stopPropagation(); startPresetGoal(${tpl.id})">
                ${isStarted ? '✓ Active Running' : '🚀 Launch Goal'}
            </button>
        `;
        container.appendChild(card);
    });
}

// Action to start a pre-available template goal
function startPresetGoal(id) {
    const tpl = TEMPLATE_GOALS.find(t => t.id === id);
    if (!tpl) return;
    
    // Check if already active
    if (goals.some(g => g.title === tpl.title)) {
        return;
    }
    
    showSessionInterstitialAd(() => {
        // Deep copy the template
        const newGoal = { 
            id: goals.length + 1,
            title: tpl.title,
            category: tpl.category,
            completed: tpl.completed,
            total: tpl.total
        };
        goals.push(newGoal);
        renderGoals();
        renderPresets();
    });
}

// Inspect Goal details modal popup
function openDetail(goal, id) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    const heroPool = [
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&h=600&q=80", // Calendar planner
        "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&h=600&q=80", // Leather journal
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=600&q=80"  // Working advisory board
    ];
    const randomHero = heroPool[id % heroPool.length];
    const pct = Math.round((goal.completed / goal.total) * 100);

    body.innerHTML = `
        <div class="modal-hero" style="background:url('${randomHero}') center/cover; height:260px; border-radius:16px; margin-bottom:2rem; box-shadow:0 10px 25px rgba(0,0,0,0.05);"></div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 2rem;">
            <div>
                <span class="ad-tag" style="color:var(--primary); font-weight:800;">${goal.category}</span>
                <h2 style="font-size:2.2rem; font-weight:900; margin:0.5rem 0; color:var(--text); letter-spacing:-1px;">${goal.title}</h2>
            </div>
            <div style="font-size:2.4rem; font-weight:900; color:var(--primary);">${pct}%</div>
        </div>
        
        <p style="font-size:1.05rem; color:#444; line-height:1.8; margin-bottom:2.2rem;">You are currently making excellent progression towards completing "${goal.title}". Our high-performance metrics anticipate completion in approximately ${Math.floor(Math.random() * 25) + 5} days at current velocity.</p>
        
        <div class="extensive-info" style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:2rem;">
            <div style="background:#faf9ff; border:1px solid var(--border); padding:1.8rem; border-radius:16px;">
                <h3 style="margin-bottom:1rem; font-size:1.1rem; color:var(--text); font-weight:800;">Milestones Tracker</h3>
                <ul style="list-style:none; padding:0; color:var(--muted); font-size:0.9rem; display:flex; flex-direction:column; gap:0.5rem;">
                    <li><strong>Completed Tasks:</strong> ${goal.completed} Milestones</li>
                    <li><strong>Pending Tasks:</strong> ${goal.total - goal.completed} Milestones</li>
                    <li><strong>Status:</strong> Active Progress</li>
                </ul>
            </div>
            <div style="background:#faf9ff; border:1px solid var(--border); padding:1.8rem; border-radius:16px;">
                <h3 style="margin-bottom:1rem; font-size:1.1rem; color:var(--text); font-weight:800;">Community Velocity</h3>
                <p style="font-size:0.88rem; color:var(--muted); line-height:1.5;">Achieving this goal places you in the top 8% of performers in the ${goal.category} sector. Streak multipliers will initiate upon completion.</p>
            </div>
        </div>
    `;
    
    // Choose details modal sponsor campaign
    const detailCampaign = PRODUCTIVITY_CAMPAIGNS[id % PRODUCTIVITY_CAMPAIGNS.length];
    const detailImg = document.getElementById('detail-ad-img');
    const detailTitle = document.getElementById('detail-ad-title');
    const detailDesc = document.getElementById('detail-ad-desc');
    
    if (detailImg) detailImg.src = detailCampaign.img;
    if (detailTitle) detailTitle.innerText = detailCampaign.title;
    if (detailDesc) detailDesc.innerText = detailCampaign.desc;

    modal.style.display = 'flex';
}

document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('detailModal').style.display = 'none';
});

window.onclick = (event) => {
    const modal = document.getElementById('detailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


// --- 2. Dynamic Goal Creation System ---
const goalModal = document.getElementById('goalModal');
const btnOpenAddGoal = document.getElementById('btn-open-add-goal');
const btnCloseGoalModal = document.getElementById('btn-close-goal-modal');

if (btnOpenAddGoal) {
    btnOpenAddGoal.addEventListener('click', () => {
        if (goalModal) goalModal.style.display = 'flex';
    });
}

if (btnCloseGoalModal) {
    btnCloseGoalModal.addEventListener('click', () => {
        if (goalModal) goalModal.style.display = 'none';
    });
}

function submitNewGoal() {
    const title = document.getElementById('goal-title').value;
    const completed = parseInt(document.getElementById('goal-tasks-completed').value);
    const total = parseInt(document.getElementById('goal-tasks-total').value);
    const category = document.getElementById('goal-category').value;

    if (!title || isNaN(completed) || isNaN(total) || completed < 0 || total < 1) {
        alert('❌ Please complete all goal fields with valid parameters.');
        return;
    }
    if (completed > total) {
        alert('❌ Completed tasks cannot exceed total tasks.');
        return;
    }

    const newGoal = {
        id: goals.length + 1,
        title,
        category,
        completed,
        total
    };

    if (goalModal) goalModal.style.display = 'none';
    document.getElementById('goal-form').reset();

    // Trigger productivity skip-ad interstitial before appending
    showSessionInterstitialAd(() => {
        goals.unshift(newGoal);
        renderGoals();
    });
}


// --- 3. Programmatic Rotating Sponsor Banner ---
let bannerIndex = 0;
function startRotatingBanner() {
    const banner = document.getElementById('floating-ad-banner');
    if (!banner || adsDisabled) return;

    const campaign = PRODUCTIVITY_CAMPAIGNS[bannerIndex];
    bannerIndex = (bannerIndex + 1) % PRODUCTIVITY_CAMPAIGNS.length;

    banner.innerHTML = `
        <div class="ad-sponsor-container">
            <img src="${campaign.img}" alt="${campaign.title}">
            <div class="banner-content">
                <p>Curated Focus Sponsor</p>
                <strong>${campaign.title}</strong>
            </div>
        </div>
        <div class="banner-actions">
            <button class="btn-banner-action" id="btn-banner-claim">Claim Resource</button>
            <button class="btn-banner-close" id="btn-banner-close">×</button>
        </div>
    `;

    banner.style.display = 'flex';

    // Hook listeners
    document.getElementById('btn-banner-claim')?.addEventListener('click', () => {
        alert(`🎉 Copied coupon code: "${campaign.promo.split('"')[1] || 'GOALPRO'}" to clipboard!`);
        window.open('#', '_blank');
    });

    document.getElementById('btn-banner-close')?.addEventListener('click', () => {
        banner.style.display = 'none';
    });
}

// Initial banner launch and rotate every 10 seconds
setTimeout(() => {
    startRotatingBanner();
    setInterval(startRotatingBanner, 10000);
}, 2000);


// --- 4. Decoupled Timed Interstitial Countdown System ---
let interstitialCallback = null;
let interstitialTimer = null;
const interstitialModal = document.getElementById('interstitialModal');
const btnSkipAd = document.getElementById('btn-skip-ad');
const btnClaimAd = document.getElementById('btn-claim-ad');

function showSessionInterstitialAd(onClosed) {
    if (adsDisabled || !interstitialModal) {
        onClosed();
        return;
    }
    
    interstitialCallback = onClosed;
    
    // Choose a random campaign
    const campaign = PRODUCTIVITY_CAMPAIGNS[Math.floor(Math.random() * PRODUCTIVITY_CAMPAIGNS.length)];
    const imgEl = document.getElementById('interstitial-ad-img');
    const titleEl = document.getElementById('interstitial-ad-title');
    const descEl = document.getElementById('interstitial-ad-desc');
    const promoEl = document.getElementById('interstitial-ad-promo');
    
    if (imgEl) imgEl.src = campaign.img;
    if (titleEl) titleEl.innerText = campaign.title;
    if (descEl) descEl.innerText = campaign.desc;
    if (promoEl) promoEl.innerText = campaign.promo;

    interstitialModal.style.display = 'flex';
    
    btnSkipAd.disabled = true;
    btnSkipAd.style.opacity = '0.4';
    btnSkipAd.style.cursor = 'not-allowed';
    btnSkipAd.innerText = 'Skip Ad in 5s';
    
    let count = 5;
    if (interstitialTimer) clearInterval(interstitialTimer);
    
    interstitialTimer = setInterval(() => {
        count--;
        if (count > 0) {
            btnSkipAd.innerText = `Skip Ad in ${count}s`;
        } else {
            clearInterval(interstitialTimer);
            btnSkipAd.innerText = 'Skip Ad';
            btnSkipAd.disabled = false;
            btnSkipAd.style.opacity = '1';
            btnSkipAd.style.cursor = 'pointer';
        }
    }, 1000);
}

if (btnSkipAd) {
    btnSkipAd.addEventListener('click', () => {
        interstitialModal.style.display = 'none';
        
        // Trigger success synchronization celebration modal!
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

if (btnClaimAd) {
    btnClaimAd.addEventListener('click', () => {
        alert('🎉 Productivity priority channel whitelisted!');
        interstitialModal.style.display = 'none';
        
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

// Celebration close handler
const btnCloseCelebrationModal = document.getElementById('btn-close-celebration');
if (btnCloseCelebrationModal) {
    btnCloseCelebrationModal.addEventListener('click', () => {
        document.getElementById('celebrationModal').style.display = 'none';
        if (interstitialCallback) {
            interstitialCallback();
            interstitialCallback = null;
        }
    });
}


// --- 5. Scarcity Upgrade Tier & Timer Engine ---
let upgradeTimer = null;
const premiumUpgradeModal = document.getElementById('premiumUpgradeModal');

function triggerUpgradeModal() {
    if (adsDisabled || !premiumUpgradeModal) return;
    
    premiumUpgradeModal.style.display = 'flex';
    let duration = 600; // 10 minutes
    const countdownEl = document.getElementById('scarcity-countdown');

    if (upgradeTimer) clearInterval(upgradeTimer);

    upgradeTimer = setInterval(() => {
        duration--;
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        if (countdownEl) {
            countdownEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        if (duration <= 0) {
            clearInterval(upgradeTimer);
            premiumUpgradeModal.style.display = 'none';
        }
    }, 1000);
}

// Trigger upgrade modal after 40 seconds of active portfolio browsing
setTimeout(triggerUpgradeModal, 40000);

document.getElementById('btn-skip-upgrade')?.addEventListener('click', () => {
    premiumUpgradeModal.style.display = 'none';
    clearInterval(upgradeTimer);
});

// Acknowledge upgrade purchase (disable ads)
document.getElementById('btn-upgrade-now')?.addEventListener('click', () => {
    alert('🏆 Welcome to GoalStream Pro! Creative focus campaigns are disabled.');
    adsDisabled = true;
    premiumUpgradeModal.style.display = 'none';
    const banner = document.getElementById('floating-ad-banner');
    if (banner) banner.style.display = 'none';
    clearInterval(upgradeTimer);
});


// --- 6. Exit Intent & Mock Ad-Blocker Overlays ---
let exitIntentShown = false;
document.addEventListener("mouseout", (e) => {
    if (e.clientY < 0 && !exitIntentShown && !adsDisabled) {
        exitIntentShown = true;
        const exitModal = document.getElementById("exitIntentModal");
        if (exitModal) exitModal.style.display = "flex";
    }
});

document.getElementById("closeExitIntent")?.addEventListener("click", () => {
    document.getElementById("exitIntentModal").style.display = "none";
});
document.getElementById("declineExitIntent")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("exitIntentModal").style.display = "none";
});

// Trigger Mock ad blocker Whitelist popups after 5 seconds
setTimeout(() => {
    if (adsDisabled) return;
    const isAdBlockerActive = Math.random() < 0.15; // 15% simulation chance
    if (isAdBlockerActive) {
        const adBlockModal = document.getElementById("adBlockModal");
        if (adBlockModal) adBlockModal.style.display = "flex";
    }
}, 5000);

document.getElementById('btn-adblock-premium')?.addEventListener('click', () => {
    alert('🏆 GoalStream Pro Activated! Focus banners disabled.');
    adsDisabled = true;
    document.getElementById("adBlockModal").style.display = "none";
    const banner = document.getElementById('floating-ad-banner');
    if (banner) banner.style.display = 'none';
});

// Window load triggers
window.onload = () => {
    renderGoals();
    renderPresets();
};
