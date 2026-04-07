// ========================================
// 流云观影 - Apple Style Interactions
// ========================================

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('active');

            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('visible');
        }
    });
}

// Initial reveal check and scroll listener
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Navbar scroll effect (subtle)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    }
});

// Load QR Code and Sample Images from localStorage
const scrollingRows = [
    document.getElementById('scrollingRow1'),
    document.getElementById('scrollingRow2')
];

const sampleImages = [
    'https://picsum.photos/200/280?random=1',
    'https://picsum.photos/200/280?random=2',
    'https://picsum.photos/200/280?random=3',
    'https://picsum.photos/200/280?random=4',
    'https://picsum.photos/200/280?random=5',
    'https://picsum.photos/200/280?random=6',
    'https://picsum.photos/200/280?random=7',
    'https://picsum.photos/200/280?random=8'
];

function createScrollingItem(imageSrc, index) {
    const item = document.createElement('div');
    item.className = 'scrolling-item';
    item.innerHTML = `
        <img src="${imageSrc}" alt="作品 ${index + 1}" loading="lazy">
        <div class="item-overlay">作品 ${index + 1}</div>
    `;
    return item;
}

function loadQRCode() {
    const qrCode = localStorage.getItem('wechatQRCode');
    if (qrCode) {
        const contactQR = document.getElementById('contact-qrcode');
        const popupQR = document.getElementById('popup-qrcode');
        const qrHint = document.getElementById('qr-hint');

        if (contactQR) {
            contactQR.src = qrCode;
            contactQR.style.display = 'block';
        }
        if (popupQR) {
            popupQR.src = qrCode;
            popupQR.style.display = 'block';
        }
        if (qrHint) {
            qrHint.style.display = 'none';
        }
    }
}

function loadScrollingImages() {
    const storedImages = localStorage.getItem('sampleImages');
    const images = storedImages ? JSON.parse(storedImages) : sampleImages;

    scrollingRows.forEach((row, rowIndex) => {
        if (!row) return;
        const imagesPerRow = 4;
        for (let i = 0; i < imagesPerRow; i++) {
            const imgIndex = (rowIndex * imagesPerRow + i) % images.length;
            const item = createScrollingItem(images[imgIndex], rowIndex * imagesPerRow + i);
            row.appendChild(item);
        }
        // Duplicate for seamless loop
        for (let i = 0; i < imagesPerRow; i++) {
            const imgIndex = (rowIndex * imagesPerRow + i) % images.length;
            const item = createScrollingItem(images[imgIndex], rowIndex * imagesPerRow + i + 100);
            row.appendChild(item);
        }
    });
}

// Initialize on page load
loadQRCode();
loadScrollingImages();

// ========================================
// Developer Mode
// ========================================
const devModeLink = document.getElementById('devModeLink');
const devModal = document.getElementById('devModal');
const devClose = document.getElementById('devClose');
const devPasswordInput = document.getElementById('devPassword');
const devSubmit = document.getElementById('devSubmit');
const devError = document.getElementById('devError');
const devPasswordSection = document.getElementById('devPasswordSection');
const devUploadSection = document.getElementById('devUploadSection');

const DEV_PASSWORD = '88888888';

// QR Code elements
const qrInput = document.getElementById('qrInput');
const qrPreview = document.getElementById('qrPreview');
const qrPreviewImg = document.getElementById('qrPreviewImg');
const deleteQR = document.getElementById('deleteQR');

// Sample images elements
const sampleInput = document.getElementById('sampleInput');
const samplePreview = document.getElementById('samplePreview');
const sampleGrid = document.getElementById('sampleGrid');
const sampleCount = document.getElementById('sampleCount');
const addMoreSamples = document.getElementById('addMoreSamples');

const saveAllBtn = document.getElementById('saveAll');
const resetAllBtn = document.getElementById('resetAll');
const devSuccess = document.getElementById('devSuccess');

let pendingQR = null;
let pendingSamples = [];

function showMessage(msg, type) {
    devSuccess.textContent = msg;
    devSuccess.style.color = type === 'success' ? '#00c864' : '#ff3c3c';
    setTimeout(() => {
        devSuccess.textContent = '';
    }, 3000);
}

function updateDevPreview() {
    // Update QR preview
    const storedQR = localStorage.getItem('wechatQRCode');
    if (storedQR) {
        qrPreview.style.display = 'block';
        qrPreviewImg.src = storedQR;
    } else {
        qrPreview.style.display = 'none';
    }

    // Update sample preview
    const storedSamples = JSON.parse(localStorage.getItem('sampleImages')) || null;
    const samples = storedSamples || sampleImages;
    sampleCount.textContent = samples.length;

    if (samples.length > 0) {
        samplePreview.style.display = 'block';
        sampleGrid.innerHTML = '';
        samples.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '作品 ' + (index + 1);
            img.onclick = () => {
                if (confirm('删除这张图片?')) {
                    samples.splice(index, 1);
                    localStorage.setItem('sampleImages', JSON.stringify(samples));
                    updateDevPreview();
                    showMessage('图片已删除', 'success');
                }
            };
            sampleGrid.appendChild(img);
        });
    } else {
        samplePreview.style.display = 'none';
    }
}

function openDevMode() {
    devModal.classList.add('active');
    devPasswordSection.style.display = 'block';
    devUploadSection.style.display = 'none';
    devPasswordInput.value = '';
    devError.textContent = '';
    pendingQR = null;
    pendingSamples = [];
    updateDevPreview();
}

function closeDevMode() {
    devModal.classList.remove('active');
}

function verifyPassword() {
    if (devPasswordInput.value === DEV_PASSWORD) {
        devPasswordSection.style.display = 'none';
        devUploadSection.style.display = 'block';
    } else {
        devError.textContent = '密码错误，请重试';
        devPasswordInput.value = '';
        devPasswordInput.focus();
    }
}

devModeLink.addEventListener('click', (e) => {
    e.preventDefault();
    openDevMode();
});

devClose.addEventListener('click', closeDevMode);

devModal.addEventListener('click', (e) => {
    if (e.target === devModal) {
        closeDevMode();
    }
});

devSubmit.addEventListener('click', verifyPassword);
devPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyPassword();
    }
});

// QR Code upload
qrInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            pendingQR = e.target.result;
            qrPreview.style.display = 'block';
            qrPreviewImg.src = pendingQR;
        };
        reader.readAsDataURL(file);
    }
});

deleteQR.addEventListener('click', () => {
    localStorage.removeItem('wechatQRCode');
    pendingQR = null;
    updateDevPreview();
    showMessage('二维码已删除', 'success');
});

// Sample images upload
sampleInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                pendingSamples.push(e.target.result);
                updateSamplePreview();
            };
            reader.readAsDataURL(file);
        }
    });
});

addMoreSamples.addEventListener('click', () => {
    sampleInput.click();
});

function updateSamplePreview() {
    const storedSamples = JSON.parse(localStorage.getItem('sampleImages')) || [];
    const allSamples = [...storedSamples, ...pendingSamples];

    sampleCount.textContent = allSamples.length;
    samplePreview.style.display = 'block';
    sampleGrid.innerHTML = '';

    allSamples.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '作品 ' + (index + 1);
        img.onclick = () => {
            if (confirm('删除这张图片?')) {
                if (index < storedSamples.length) {
                    storedSamples.splice(index, 1);
                    localStorage.setItem('sampleImages', JSON.stringify(storedSamples));
                } else {
                    pendingSamples.splice(index - storedSamples.length, 1);
                }
                updateSamplePreview();
                showMessage('图片已删除', 'success');
            }
        };
        sampleGrid.appendChild(img);
    });
}

// Save all
saveAllBtn.addEventListener('click', () => {
    if (pendingQR) {
        localStorage.setItem('wechatQRCode', pendingQR);
        loadQRCode();
    }

    if (pendingSamples.length > 0) {
        const storedSamples = JSON.parse(localStorage.getItem('sampleImages')) || [];
        const allSamples = [...storedSamples, ...pendingSamples];
        localStorage.setItem('sampleImages', JSON.stringify(allSamples));
        loadScrollingImages();
    }

    showMessage('保存成功！', 'success');
    pendingQR = null;
    pendingSamples = [];
    updateDevPreview();
});

// Reset all
resetAllBtn.addEventListener('click', () => {
    if (confirm('确定恢复默认设置？')) {
        localStorage.removeItem('wechatQRCode');
        localStorage.removeItem('sampleImages');
        loadQRCode();
        loadScrollingImages();
        showMessage('已恢复默认设置', 'success');
        pendingQR = null;
        pendingSamples = [];
        updateDevPreview();
    }
});

// ========================================
// Privacy Policy & Terms of Service Modals
// ========================================
const privacyLink = document.getElementById('openPrivacy');
const termsLink = document.getElementById('openTerms');
const privacyModal = document.getElementById('privacyModal');
const termsModal = document.getElementById('termsModal');
const privacyClose = document.getElementById('privacyClose');
const termsClose = document.getElementById('termsClose');

function openLegalModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLegalModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLegalModal(privacyModal);
    });
}

if (termsLink) {
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLegalModal(termsModal);
    });
}

if (privacyClose) {
    privacyClose.addEventListener('click', () => closeLegalModal(privacyModal));
}

if (termsClose) {
    termsClose.addEventListener('click', () => closeLegalModal(termsModal));
}

if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) closeLegalModal(privacyModal);
    });
}

if (termsModal) {
    termsModal.addEventListener('click', (e) => {
        if (e.target === termsModal) closeLegalModal(termsModal);
    });
}

