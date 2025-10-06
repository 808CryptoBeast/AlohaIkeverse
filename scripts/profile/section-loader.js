// Load all profile sections
async function loadProfileSections() {
    const sections = [
        { id: 'navigation-container', file: '../pages/layout/navigation.html' },
        { id: 'profile-header-container', file: '../pages/profile-sections/profile-header.html' },
        { id: 'customization-container', file: '../pages/profile-sections/profile-customization.html' },
        { id: 'learning-stats-container', file: '../pages/profile-sections/learning-stats.html' },
        { id: 'skills-progress-container', file: '../pages/profile-sections/skills-progress.html' },
        { id: 'journey-timeline-container', file: '../pages/profile-sections/journey-timeline.html' },
        { id: 'profile-settings-container', file: '../pages/profile-sections/profile-settings.html' }
    ];

    console.log('🔄 Loading profile sections...');
    // After loading profile-header
console.log('📦 Profile header HTML loaded:', document.getElementById('profile-header-container').innerHTML.length, 'characters');

    for (const section of sections) {
        try {
            const response = await fetch(section.file);
            if (!response.ok) {
                throw new Error(`Failed to load ${section.file}: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById(section.id).innerHTML = html;
            console.log(`✅ Loaded: ${section.file}`);
            
        } catch (error) {
            console.error(`❌ Error loading ${section.file}:`, error);
            document.getElementById(section.id).innerHTML = `
                <div class="error-message">
                    <p>Failed to load content. Please refresh the page.</p>
                    <small>File: ${section.file}</small>
                </div>
            `;
        }
    }

    // Wait a bit for DOM to settle, then initialize all events
    setTimeout(() => {
        console.log('🎯 Initializing all profile events...');
        initializeAllProfileEvents();
    }, 200);
}

function initializeAllProfileEvents() {
    // Initialize section-specific events
    initializeNavigationEvents();
    setupCustomizationEvents();
    setupSettingsEvents();
    setupProfileHeaderEvents();
    
    // Initialize global events
    initializeGlobalProfileEvents();
    
    console.log('✅ All profile events initialized');
}

function initializeGlobalProfileEvents() {
    console.log('🔧 Setting up global profile events...');
    
    // Customization panel toggle
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const customizationPanel = document.getElementById('customization-panel');
    const cancelCustomization = document.getElementById('cancel-customization');
    const saveCustomization = document.getElementById('save-customization');

    console.log('Edit button:', editProfileBtn);
    console.log('Customization panel:', customizationPanel);

    if (editProfileBtn && customizationPanel) {
        editProfileBtn.addEventListener('click', () => {
            const isVisible = customizationPanel.style.display === 'block';
            customizationPanel.style.display = isVisible ? 'none' : 'block';
            editProfileBtn.textContent = isVisible ? 'Customize' : 'Close Customization';
        });
        console.log('✅ Edit profile button event added');
    }

    if (cancelCustomization && customizationPanel) {
        cancelCustomization.addEventListener('click', () => {
            customizationPanel.style.display = 'none';
            if (editProfileBtn) editProfileBtn.textContent = 'Customize';
        });
        console.log('✅ Cancel customization button event added');
    }

    if (saveCustomization && customizationPanel) {
        saveCustomization.addEventListener('click', () => {
            customizationPanel.style.display = 'none';
            if (editProfileBtn) editProfileBtn.textContent = 'Customize';
            saveProfileCustomization();
            showNotification('Profile updated successfully!', 'success');
        });
        console.log('✅ Save customization button event added');
    }

    // Avatar edit button
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    if (changeAvatarBtn && customizationPanel) {
        changeAvatarBtn.addEventListener('click', () => {
            customizationPanel.style.display = 'block';
            if (editProfileBtn) editProfileBtn.textContent = 'Close Customization';
        });
        console.log('✅ Change avatar button event added');
    }

    // Share profile button
    const shareProfileBtn = document.getElementById('share-profile-btn');
    if (shareProfileBtn) {
        shareProfileBtn.addEventListener('click', shareProfile);
        console.log('✅ Share profile button event added');
    }

    // Achievements button
    const achievementsBtn = document.getElementById('achievements-btn');
    if (achievementsBtn) {
        achievementsBtn.addEventListener('click', showAchievements);
        console.log('✅ Achievements button event added');
    }
}

function initializeNavigationEvents() {
    console.log('🔧 Setting up navigation events...');
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('✅ Theme toggle event added');
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        console.log('✅ Mobile menu event added');
    }
}

function setupCustomizationEvents() {
    console.log('🔧 Setting up customization events...');
    
    // Avatar selection
    const avatarOptions = document.querySelectorAll('.avatar-option');
    console.log('Avatar options found:', avatarOptions.length);
    
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const avatar = this.dataset.avatar;
            document.getElementById('user-avatar').textContent = avatar;
        });
    });

    // Theme selection
    const colorOptions = document.querySelectorAll('.color-option');
    console.log('Color options found:', colorOptions.length);
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            applyProfileTheme(this.dataset.theme);
        });
    });

    // Username suggestions
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    console.log('Suggestion tags found:', suggestionTags.length);
    
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            document.getElementById('username-input').value = this.dataset.name;
        });
    });

    // Bio character counter
    const bioField = document.getElementById('profile-bio');
    const bioCounter = document.getElementById('bio-length');
    if (bioField && bioCounter) {
        bioField.addEventListener('input', function() {
            bioCounter.textContent = this.value.length;
        });
        // Initialize counter
        bioCounter.textContent = bioField.value.length;
        console.log('✅ Bio character counter initialized');
    }
}

function setupSettingsEvents() {
    console.log('🔧 Setting up settings events...');
    
    // Toggle switches
    const toggles = document.querySelectorAll('.toggle-label input');
    console.log('Toggle switches found:', toggles.length);
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.parentElement.textContent.trim();
            saveSetting(setting, this.checked);
        });
    });

    // Goal selects
    const goalSelects = document.querySelectorAll('.goal-select');
    console.log('Goal selects found:', goalSelects.length);
    
    goalSelects.forEach(select => {
        select.addEventListener('change', function() {
            const goalType = this.previousElementSibling.textContent.trim();
            saveGoal(goalType, this.value);
        });
    });

    // Text buttons
    const textButtons = document.querySelectorAll('.btn-text');
    console.log('Text buttons found:', textButtons.length);
    
    textButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            handleSettingsAction(action);
        });
    });
}

function setupProfileHeaderEvents() {
    console.log('🔧 Setting up profile header events...');
    // Any profile header specific interactions can go here
}

// Rest of your functions remain the same...
function saveProfileCustomization() {
    const userData = {
        avatar: document.getElementById('user-avatar').textContent,
        username: document.getElementById('username-input').value,
        bio: document.getElementById('profile-bio').value,
        theme: document.querySelector('.color-option.selected')?.dataset.theme || 'default',
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('alohaUserProfile', JSON.stringify(userData));
    updateProfileDisplay(userData);
    console.log('💾 Profile customization saved');
}

function loadProfileCustomization() {
    const savedData = localStorage.getItem('alohaUserProfile');
    if (savedData) {
        const userData = JSON.parse(savedData);
        updateProfileDisplay(userData);
        console.log('📂 Profile customization loaded from storage');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, starting profile initialization...');
    loadProfileSections();
    loadProfileCustomization();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('alohaProfileTheme');
    if (savedTheme) {
        applyProfileTheme(savedTheme);
    }
});