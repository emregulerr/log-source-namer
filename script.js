document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Element Selection ---
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const openSettingsLink = document.getElementById('open-settings-link');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsOverlay = document.getElementById('settings-overlay');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const addFieldBtn = document.getElementById('add-field-btn');
    const copyBtn = document.getElementById('copy-btn');
    const formSection = document.getElementById('form-section');
    const outputString = document.getElementById('output-string');
    const fieldsConfigContainer = document.getElementById('fields-config-container');
    const templatePillsContainer = document.getElementById('template-pills-container');
    const templateInput = document.getElementById('template-input');
    const autoCopyCheckbox = document.getElementById('auto-copy-checkbox');

    // --- 2. Application State & Defaults ---
    let config = {
        template: '{Hostname}_{IPAddress}',
        fields: [
            { id: 1, name: 'Hostname', trim: true, casing: 'sentence', joining: 'kebab' },
            { id: 2, name: 'IPAddress', trim: true, casing: 'none', joining: 'space' }
        ],
        preferences: {
            autoCopy: false
        }
    };

    // --- Helper Functions for String Processing ---
    const sanitizeForJoining = (str) => {
        const charMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U' };
        let sanitized = str.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => charMap[m]);
        sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return sanitized.replace(/[^a-zA-Z0-9\s\.]/g, ' ').replace(/\s+/g, ' ');
    };

    // --- 3. Core Functions ---
    const toggleSettingsPanel = (forceOpen = null) => document.body.classList.toggle('settings-active', forceOpen);

    const renderTemplatePills = () => {
        templatePillsContainer.innerHTML = '';
        document.querySelectorAll('.field-name-input').forEach(input => {
            const name = input.value.trim();
            if (name === '') return;
            const pill = document.createElement('button');
            pill.className = 'template-pill';
            pill.textContent = name;
            pill.dataset.placeholder = `{${name}}`;
            templatePillsContainer.appendChild(pill);
        });
    };

    const renderSettings = () => {
        fieldsConfigContainer.innerHTML = '';
        config.fields.forEach(field => {
            const row = document.createElement('div');
            row.className = 'field-row';
            row.dataset.id = field.id;
            row.innerHTML = `
                <div class="field-header">
                    <input type="text" class="field-name-input" value="${field.name}" placeholder="Field Name">
                    <button class="remove-field-btn" title="Remove Field">&times;</button>
                </div>
                <div class="field-processors-grid">
                    <div class="processor-group">
                        <label for="casing-${field.id}">Casing</label>
                        <select id="casing-${field.id}" class="casing-select">
                            <option value="none" ${field.casing === 'none' ? 'selected' : ''}>No Change</option>
                            <option value="lowercase" ${field.casing === 'lowercase' ? 'selected' : ''}>lowercase</option>
                            <option value="uppercase" ${field.casing === 'uppercase' ? 'selected' : ''}>UPPERCASE</option>
                            <option value="capitalize" ${field.casing === 'capitalize' ? 'selected' : ''}>Capitalize</option>
                            <option value="sentence" ${field.casing === 'sentence' ? 'selected' : ''}>Sentence case.</option>
                            <option value="title" ${field.casing === 'title' ? 'selected' : ''}>Title Case</option>
                        </select>
                    </div>
                    <div class="processor-group">
                        <label for="joining-${field.id}">Word Joining</label>
                        <select id="joining-${field.id}" class="joining-select">
                            <option value="space" ${field.joining === 'space' ? 'selected' : ''}>Join with Spaces</option>
                            <option value="snake" ${field.joining === 'snake' ? 'selected' : ''}>Join with _ (snake)</option>
                            <option value="kebab" ${field.joining === 'kebab' ? 'selected' : ''}>Join with - (kebab)</option>
                            <option value="dot" ${field.joining === 'dot' ? 'selected' : ''}>Join with . (dot)</option>
                            <option value="camel" ${field.joining === 'camel' ? 'selected' : ''}>Join Together (camel)</option>
                        </select>
                    </div>
                </div>
                <div class="field-trim-group">
                    <input type="checkbox" id="trim-${field.id}" class="trim-checkbox" ${field.trim ? 'checked' : ''}>
                    <label for="trim-${field.id}">Trim leading/trailing whitespace</label>
                </div>
            `;
            fieldsConfigContainer.appendChild(row);
        });
        renderTemplatePills();
        templateInput.value = config.template;
        if (config.preferences) autoCopyCheckbox.checked = config.preferences.autoCopy;
    };

    const renderUsageForm = () => {
        formSection.innerHTML = '';
        if (config.fields.length === 0) {
            formSection.innerHTML = '<p style="text-align: center; color: var(--text-muted-color);">Welcome! Configure your first field in the settings panel.</p>';
            return;
        }
        const form = document.createElement('form');
        form.id = 'dynamic-form';
        config.fields.forEach(field => {
            form.innerHTML += `
                <div class="form-field-group" style="margin-bottom: 1rem;">
                    <label for="input-${field.id}" style="display: block; margin-bottom: 0.25rem;">${field.name}:</label>
                    <input type="text" id="input-${field.id}" placeholder="Enter value for ${field.name}...">
                </div>
            `;
        });
        formSection.appendChild(form);
    };

    const applyProcessors = (value, fieldConfig) => {
        let processedValue = value;

        if (fieldConfig.trim) processedValue = processedValue.trim();

        // Apply Casing to the raw-ish string
        switch (fieldConfig.casing) {
            case 'lowercase':
                processedValue = processedValue.toLowerCase();
                break;
            case 'uppercase':
                processedValue = processedValue.toUpperCase();
                break;
            case 'capitalize': // Capitalize only the first letter of the entire string
                processedValue = processedValue.charAt(0).toUpperCase() + processedValue.slice(1).toLowerCase();
                break;
            case 'sentence': // Capitalize after every period
                processedValue = processedValue.toLowerCase().replace(/(^\w{1})|(\.\s*\w{1})/g, (char) => char.toUpperCase());
                break;
            case 'title':
                processedValue = processedValue.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                break;
        }

        // Sanitize and Join words
        const sanitized = sanitizeForJoining(processedValue);
        switch (fieldConfig.joining) {
            case 'snake': processedValue = sanitized.replace(/\s+/g, '_'); break;
            case 'kebab': processedValue = sanitized.replace(/\s+/g, '-'); break;
            case 'dot': processedValue = sanitized.replace(/\s+/g, '.'); break;
            case 'camel':
                processedValue = sanitized.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
                break;
            default: // space
                processedValue = sanitized;
        }

        return processedValue;
    };

    let copyTimeout;
    function showCopyFeedback() {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('is-copied');
        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('is-copied');
        }, 1000);
    }

    const generateOutput = () => {
        let result = config.template;
        config.fields.forEach(field => {
            const inputElement = document.getElementById(`input-${field.id}`);
            if (inputElement) {
                const processedValue = applyProcessors(inputElement.value, field);
                result = result.replace(new RegExp(`{${field.name}}`, 'g'), processedValue);
            }
        });
        outputString.value = result;

        if (config.preferences && config.preferences.autoCopy && result) {
            navigator.clipboard.writeText(result).then(showCopyFeedback).catch(err => console.error("Auto-copy failed: ", err));
        }
    };

    const loadConfig = () => {
        const savedConfig = localStorage.getItem('logSourceNamerConfig_v11_final');
        if (savedConfig) config = JSON.parse(savedConfig);
        if (!config.preferences) config.preferences = { autoCopy: false };
        renderUsageForm();
        renderSettings();
        generateOutput();
    };

    const saveConfig = () => {
        const newFields = [];
        document.querySelectorAll('.field-row').forEach(row => {
            const name = row.querySelector('.field-name-input').value.trim();
            if (name === '') return;
            newFields.push({
                id: parseInt(row.dataset.id),
                name: name,
                trim: row.querySelector('.trim-checkbox').checked,
                casing: row.querySelector('.casing-select').value,
                joining: row.querySelector('.joining-select').value
            });
        });
        config.fields = newFields;
        config.template = templateInput.value;
        config.preferences.autoCopy = autoCopyCheckbox.checked;

        localStorage.setItem('logSourceNamerConfig_v11_final', JSON.stringify(config));

        saveConfigBtn.textContent = 'Saved!';
        setTimeout(() => { saveConfigBtn.textContent = 'Save & Close'; }, 1500);

        renderUsageForm();
        renderSettings();
        generateOutput();
    };

    // --- Event Listeners ---
    openSettingsBtn.addEventListener('click', () => toggleSettingsPanel(true));
    openSettingsLink.addEventListener('click', (e) => { e.preventDefault(); toggleSettingsPanel(true); });
    closeSettingsBtn.addEventListener('click', () => toggleSettingsPanel(false));
    settingsOverlay.addEventListener('click', () => toggleSettingsPanel(false));
    addFieldBtn.addEventListener('click', () => {
        const newId = config.fields.length > 0 ? Math.max(...config.fields.map(f => f.id)) + 1 : 1;
        config.fields.push({ id: newId, name: '', trim: true, casing: 'none', joining: 'space' });
        renderSettings();
    });
    fieldsConfigContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-field-btn')) {
            config.fields = config.fields.filter(f => f.id !== parseInt(e.target.closest('.field-row').dataset.id));
            renderSettings();
        }
    });
    fieldsConfigContainer.addEventListener('input', e => {
        if (e.target.classList.contains('field-name-input')) renderTemplatePills();
    });
    templatePillsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('template-pill')) {
            const placeholder = e.target.dataset.placeholder;
            const start = templateInput.selectionStart;
            const end = templateInput.selectionEnd;
            templateInput.value = templateInput.value.substring(0, start) + placeholder + templateInput.value.substring(end);
            templateInput.focus();
            templateInput.selectionEnd = start + placeholder.length;
        }
    });
    saveConfigBtn.addEventListener('click', () => {
        saveConfig();
        setTimeout(() => toggleSettingsPanel(false), 500);
    });
    formSection.addEventListener('input', generateOutput);
    copyBtn.addEventListener('click', () => {
        if (!outputString.value) return;
        navigator.clipboard.writeText(outputString.value).then(showCopyFeedback);
    });

    // --- Initialization ---
    loadConfig();
});