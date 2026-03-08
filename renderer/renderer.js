document.addEventListener('DOMContentLoaded', async () => {
    // Top Window Controls
    document.getElementById('btn-minimize').addEventListener('click', () => {
        window.api.windowMinimize();
    });

    document.getElementById('btn-maximize').addEventListener('click', () => {
        window.api.windowMaximize();
    });

    document.getElementById('btn-close').addEventListener('click', () => {
        window.api.windowClose();
    });

    // View Selector (Hover Menu)
    const btnLayout = document.getElementById('btn-layout');
    const layoutOptions = document.querySelectorAll('.layout-option');
    const contentArea = document.getElementById('content-area');
    const dragOverlay = document.getElementById('drag-overlay');
    const GEMINI_URL = 'https://gemini.google.com/';

    layoutOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const count = parseInt(e.currentTarget.getAttribute('data-layout'), 10);
            renderLayout(count);
            // Hide dropdown explicitly after click
            document.getElementById('layout-dropdown').style.display = 'none';
            setTimeout(() => document.getElementById('layout-dropdown').style.display = '', 100);
        });
    });

    function createWebview() {
        const wv = document.createElement('webview');
        wv.src = GEMINI_URL;
        wv.partition = 'persist:gemini';
        return wv;
    }

    function createResizer(type) {
        const div = document.createElement('div');
        div.className = `resizer resizer-${type}`;
        return div;
    }

    function renderLayout(count) {
        // Clear current content except overlay
        Array.from(contentArea.children).forEach(child => {
            if (child.id !== 'drag-overlay') {
                contentArea.removeChild(child);
            }
        });

        if (count === 1) {
            contentArea.appendChild(createWebview());
        } else if (count === 2) {
            const row = document.createElement('div');
            row.className = 'layout-row';
            
            const wv1 = createWebview();
            const wv2 = createWebview();
            const resizer = createResizer('horizontal');

            row.appendChild(wv1);
            row.appendChild(resizer);
            row.appendChild(wv2);
            contentArea.appendChild(row);

            makeResizable(resizer, wv1, wv2, 'horizontal');
        } else if (count === 4) {
            const mainCol = document.createElement('div');
            mainCol.className = 'layout-col';

            const topRow = document.createElement('div');
            topRow.className = 'layout-row';
            const wv1 = createWebview();
            const wv2 = createWebview();
            const resizerTop = createResizer('horizontal');
            topRow.appendChild(wv1); topRow.appendChild(resizerTop); topRow.appendChild(wv2);

            const bottomRow = document.createElement('div');
            bottomRow.className = 'layout-row';
            const wv3 = createWebview();
            const wv4 = createWebview();
            const resizerBottom = createResizer('horizontal');
            bottomRow.appendChild(wv3); bottomRow.appendChild(resizerBottom); bottomRow.appendChild(wv4);

            const resizerMain = createResizer('vertical');

            mainCol.appendChild(topRow);
            mainCol.appendChild(resizerMain);
            mainCol.appendChild(bottomRow);
            
            contentArea.appendChild(mainCol);

            makeResizable(resizerTop, wv1, wv2, 'horizontal');
            makeResizable(resizerBottom, wv3, wv4, 'horizontal');
            makeResizable(resizerMain, topRow, bottomRow, 'vertical');
        }
    }

    function makeResizable(resizer, firstElement, secondElement, direction) {
        let isDown = false;

        resizer.addEventListener('mousedown', (e) => {
            isDown = true;
            dragOverlay.classList.remove('hidden'); // Block webviews from stealing mouse
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            
            if (direction === 'horizontal') {
                const containerWidth = firstElement.parentElement.offsetWidth;
                const newWidth = (e.clientX - firstElement.parentElement.getBoundingClientRect().left) / containerWidth * 100;
                if (newWidth > 5 && newWidth < 95) { // Constraints
                    firstElement.style.flex = `0 0 ${newWidth}%`;
                    secondElement.style.flex = `1 1 0%`;
                }
            } else {
                const containerHeight = firstElement.parentElement.offsetHeight;
                const newHeight = (e.clientY - firstElement.parentElement.getBoundingClientRect().top) / containerHeight * 100;
                if (newHeight > 5 && newHeight < 95) { // Constraints
                    firstElement.style.flex = `0 0 ${newHeight}%`;
                    secondElement.style.flex = `1 1 0%`;
                }
            }
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
            dragOverlay.classList.add('hidden');
        });
    }

    // Initialize default layout
    renderLayout(1);

    // Always on Top
    const btnPin = document.getElementById('btn-pin');
    let isPinned = false;
    
    // Initialize pin state
    const settings = await window.api.getSettings();
    isPinned = settings.alwaysOnTop;
    if (isPinned) btnPin.classList.add('active');

    btnPin.addEventListener('click', () => {
        isPinned = !isPinned;
        if (isPinned) {
            btnPin.classList.add('active');
        } else {
            btnPin.classList.remove('active');
        }
        window.api.toggleAlwaysOnTop(isPinned);
    });

    // Listen for updates from main process tray menu
    window.api.onAlwaysOnTopChanged((value) => {
        isPinned = value;
        if (isPinned) {
            btnPin.classList.add('active');
        } else {
            btnPin.classList.remove('active');
        }
    });

    // External Links in Footer
    const links = document.querySelectorAll('.footer-links a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.target.getAttribute('data-url');
            if (url) {
                window.api.openExternal(url);
            }
        });
    });

    // Settings Modal
    const settingsModal = document.getElementById('settings-modal');
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');

    const inputShortcut = document.getElementById('input-shortcut');
    const chkTray = document.getElementById('chk-tray');
    const chkStartup = document.getElementById('chk-startup');
    const chkHwAccel = document.getElementById('chk-hwaccel');

    async function loadSettingsToUI() {
        const currentSettings = await window.api.getSettings();
        inputShortcut.value = currentSettings.shortcut || '';
        chkTray.checked = currentSettings.keepInTray || false;
        chkStartup.checked = currentSettings.runOnStartup || false;
        chkHwAccel.checked = currentSettings.disableHardwareAcceleration || false;
    }

    function openSettings() {
        loadSettingsToUI();
        settingsModal.classList.remove('hidden');
    }

    btnSettings.addEventListener('click', openSettings);
    window.api.onOpenSettings(openSettings);

    btnCloseSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    btnSaveSettings.addEventListener('click', () => {
        const updatedSettings = {
            shortcut: inputShortcut.value,
            keepInTray: chkTray.checked,
            runOnStartup: chkStartup.checked,
            disableHardwareAcceleration: chkHwAccel.checked
        };
        window.api.saveSettings(updatedSettings);
        settingsModal.classList.add('hidden');
    });

    // Offline Handling
    const offlineSplash = document.getElementById('offline-splash');

    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineSplash.classList.add('hidden');
        } else {
            offlineSplash.classList.remove('hidden');
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
});
