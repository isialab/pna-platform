document.addEventListener('DOMContentLoaded', () => {
    // Check if running via file protocol
    if (window.location.protocol === 'file:') {
        alert("ATTENZIONE: Stai aprendo il sito come file locale. PHP non può funzionare in questo modo.\n\nDevi avviare un server locale.\nApri il terminale nella cartella del progetto ed esegui:\nphp -S localhost:8000\n\nPoi visita: http://localhost:8000");
        return;
    }

    // Initialize Bootstrap Italia components
    // Example: Input fields with floating labels need initialization if added dynamically,
    // but static ones usually work if structure is correct.
    // However, we might need to manually trigger some if they don't auto-init.
    // For now, we rely on the bundle.js auto-init.

    // Check if we are on the registration page
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        handleRegistration(registrationForm);
    }

    // Check if we are on the dashboard page
    // We check for the sidebar wrapper or a specific dashboard element
    const sidebarWrapper = document.querySelector('.sidebar-wrapper');
    if (sidebarWrapper) {
        handleDashboard();
    }
});

function handleRegistration(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic Validation (Bootstrap Italia style)
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (password !== confirmPassword) {
            alert('Le password non coincidono!');
            return;
        }

        // Collect all form data
        const formData = new FormData(form);
        const userProfile = {};
        formData.forEach((value, key) => {
            if (key !== 'password' && key !== 'confirm_password') {
                userProfile[key] = value;
            }
        });

        // Send to PHP Backend
        fetch('api.php?action=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userProfile),
        })
            .then(async response => {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    if (!response.ok) {
                        throw new Error(data.message || 'Server error');
                    }
                    return data;
                } catch (e) {
                    console.error('Server response:', text);
                    if (text.includes('<?php')) {
                        throw new Error('PHP non eseguito. Assicurati di usare un server web (es. localhost).');
                    }
                    throw new Error('Risposta del server non valida: ' + (e.message || text.substring(0, 50)));
                }
            })
            .then(data => {
                console.log('Success:', data);

                // Save to localStorage for frontend state management
                localStorage.setItem('pna_user_profile', JSON.stringify(userProfile));
                localStorage.setItem('pna_user_name', `${userProfile.nome} ${userProfile.cognome}`);

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Errore: ' + error.message);
            });
    });
}

function handleDashboard() {
    // Retrieve user data
    const userName = localStorage.getItem('pna_user_name');
    const userProfileString = localStorage.getItem('pna_user_profile');

    if (userName) {
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) {
            userNameDisplay.textContent = userName;
        }
    } else {
        // Redirect to login if no user found (simple protection)
        window.location.href = 'index.html';
        return;
    }

    // Navigation Logic
    const navLinks = document.querySelectorAll('.list-item'); // Bootstrap Italia sidebar links
    const sections = document.querySelectorAll('.section-content');
    const pageTitle = document.getElementById('pageTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));
            sections.forEach(section => section.classList.remove('active'));

            // Show target section
            const sectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('active');
            }

            // Update Title
            if (pageTitle) {
                pageTitle.textContent = link.querySelector('span').textContent;
            }
        });
    });

    // Populate Profile Data
    if (userProfileString) {
        try {
            const userProfile = JSON.parse(userProfileString);

            // Map profile data to inputs
            // Note: IDs in dashboard.html are prefixed with 'profile_'
            for (const [key, value] of Object.entries(userProfile)) {
                const element = document.getElementById(`profile_${key}`);
                if (element) {
                    element.value = value;

                    // Bootstrap Italia: Activate label for pre-filled inputs
                    const label = document.querySelector(`label[for="profile_${key}"]`);
                    if (label) {
                        label.classList.add('active');
                    }
                }
            }
        } catch (e) {
            console.error("Error parsing user profile", e);
        }
    }

    // New Candidacy Button
    const newCandidacyBtn = document.getElementById('newCandidacyBtn');
    if (newCandidacyBtn) {
        newCandidacyBtn.addEventListener('click', () => {
            alert('Funzionalità di Nuova Candidatura in arrivo!');
        });
    }
}
