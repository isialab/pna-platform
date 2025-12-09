document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('applicationForm');
    const steps = document.querySelectorAll('.step-content');
    const indicators = document.querySelectorAll('.step-indicator');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    let currentStep = 1;
    const totalSteps = steps.length;

    // Initialize
    updateWizard();

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateWizard();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizard();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            alert('Candidatura inviata con successo! (Simulazione)');
            // Here you would typically send the data to the backend
            console.log('Form Data:', new FormData(form));
        }
    });

    function updateWizard() {
        // Update Steps Visibility
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.id.replace('step', '')) === currentStep) {
                step.classList.add('active');
            }
        });

        // Update Indicators
        indicators.forEach(indicator => {
            const stepNum = parseInt(indicator.dataset.step);
            indicator.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < currentStep) {
                indicator.classList.add('completed');
            }
        });

        // Update Buttons
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            populateSummary();
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    function validateStep(step) {
        const currentStepEl = document.getElementById(`step${step}`);
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444'; // Red border
                
                // Reset border on input
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Per favore, compila tutti i campi obbligatori.');
        }

        return isValid;
    }

    function populateSummary() {
        const summaryProfile = document.getElementById('summary-profile');
        const summaryCandidacy = document.getElementById('summary-candidacy');
        const summaryProject = document.getElementById('summary-project');

        // Helper to create summary item
        const createItem = (label, value) => {
            return `
                <div class="summary-item">
                    <span class="summary-label">${label}:</span>
                    <span class="summary-value">${value || '-'}</span>
                </div>
            `;
        };

        // Profile Data
        summaryProfile.innerHTML = `
            ${createItem('Nome', document.getElementById('nome').value)}
            ${createItem('Cognome', document.getElementById('cognome').value)}
            ${createItem('Email', document.getElementById('email').value)}
            ${createItem('Corso', document.getElementById('corso_accademico').value)}
        `;

        // Candidacy Data
        const istituzioneSelect = document.getElementById('istituzione');
        const sezioneSelect = document.getElementById('sezione');
        
        summaryCandidacy.innerHTML = `
            ${createItem('Istituzione', istituzioneSelect.options[istituzioneSelect.selectedIndex]?.text)}
            ${createItem('Sezione', sezioneSelect.options[sezioneSelect.selectedIndex]?.text)}
            ${createItem('Referente', document.getElementById('referente_nome').value)}
        `;

        // Project Data
        const tipoProgettoSelect = document.getElementById('tipo_progetto');
        
        summaryProject.innerHTML = `
            ${createItem('Titolo', document.getElementById('titolo_progetto').value)}
            ${createItem('Tipo', tipoProgettoSelect.options[tipoProgettoSelect.selectedIndex]?.text)}
            ${createItem('Anno', document.getElementById('anno_progetto').value)}
        `;
    }

    // File input custom label update
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            const label = this.nextElementSibling;
            if (fileName) {
                label.textContent = fileName;
                label.style.borderColor = 'var(--primary-color)';
                label.style.color = 'var(--primary-color)';
            }
        });
    });
});
