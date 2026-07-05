import { db } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function initLiveBanner() {
    // 1. Create style rules dynamically to keep it clean and performant
    const styleId = 'live-banner-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .live-banner-alert {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 40px;
                background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                z-index: 1040;
                box-shadow: 0 2px 10px rgba(220, 38, 38, 0.3);
                font-family: 'Inter', sans-serif;
                font-size: 0.85rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                transition: transform 0.3s ease;
                padding: 0 15px;
                text-decoration: none !important;
            }
            .live-banner-alert:hover {
                background: linear-gradient(90deg, #b91c1c 0%, #dc2626 100%);
                color: #ffffff !important;
            }
            .live-pulse-dot {
                width: 10px;
                height: 10px;
                background-color: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
                animation: livePulse 1.6s infinite;
                display: inline-block;
            }
            @keyframes livePulse {
                0% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
                }
                70% {
                    transform: scale(1);
                    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
                }
                100% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
                }
            }
            .live-btn-join {
                background: #ffffff;
                color: #dc2626 !important;
                padding: 3px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.2s ease;
                border: none;
                margin-left: 5px;
            }
            .live-btn-join:hover {
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            /* Push fixed glass nav down when live banner is active */
            body.has-live-banner .glass-nav {
                top: 40px !important;
            }
            body.has-live-banner {
                padding-top: 40px !important;
            }
            @media (max-width: 768px) {
                .live-banner-alert {
                    font-size: 0.75rem;
                    gap: 6px;
                }
                .live-btn-join {
                    padding: 2px 8px;
                    font-size: 0.68rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Listen to /config/live in Firestore
    onSnapshot(doc(db, "config", "live"), (docSnap) => {
        const activeBanner = document.getElementById('global-live-banner');
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            if (data.isLive === true) {
                document.body.classList.add('has-live-banner');
                
                let platformName = 'Facebook';
                let defaultUrl = 'https://www.facebook.com/carlos.pinedaaraujo/';
                
                if (data.platform === 'tiktok') {
                    platformName = 'TikTok';
                    defaultUrl = 'https://www.tiktok.com/@casadelgranrey';
                } else if (data.platform === 'youtube') {
                    platformName = 'YouTube';
                    defaultUrl = 'https://www.youtube.com/';
                }

                // If admin didn't specify a custom URL, use default profile/page URL
                const targetUrl = data.url && data.url.trim() !== "" ? data.url : defaultUrl;

                if (!activeBanner) {
                    const banner = document.createElement('a');
                    banner.id = 'global-live-banner';
                    banner.className = 'live-banner-alert';
                    banner.href = targetUrl;
                    banner.target = '_blank';
                    banner.innerHTML = `
                        <span class="live-pulse-dot"></span>
                        <span>¡ESTAMOS EN VIVO EN ${platformName.toUpperCase()}!</span>
                        <button class="live-btn-join">VER TRANSMISIÓN <i class="fa-solid fa-arrow-right ms-1"></i></button>
                    `;
                    document.body.insertBefore(banner, document.body.firstChild);
                } else {
                    activeBanner.href = targetUrl;
                    activeBanner.innerHTML = `
                        <span class="live-pulse-dot"></span>
                        <span>¡ESTAMOS EN VIVO EN ${platformName.toUpperCase()}!</span>
                        <button class="live-btn-join">VER TRANSMISIÓN <i class="fa-solid fa-arrow-right ms-1"></i></button>
                    `;
                }
            } else {
                // Remove banner if disabled
                document.body.classList.remove('has-live-banner');
                if (activeBanner) activeBanner.remove();
            }
        } else {
            document.body.classList.remove('has-live-banner');
            if (activeBanner) activeBanner.remove();
        }
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveBanner);
} else {
    initLiveBanner();
}
