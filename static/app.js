let currentResults = null;

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    addButtonAnimation(event.target);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Demo key functionality
function fillDemoKey() {
    const apiKeyInput = document.getElementById('api-key');
    apiKeyInput.value = 'AIzaSyCEaO89I1KPywUJlx_9Kxk_ygr9e63Dggw';
    addButtonAnimation(event.target);
    
    // Show success message
    showSuccess('Demo API key filled successfully!');
    setTimeout(hideMessages, 3000);
}

// Button animation function
function addButtonAnimation(button) {
    button.classList.add('btn-press-animation');
    setTimeout(() => {
        button.classList.remove('btn-press-animation');
    }, 200);
}

function showLoading() {
    document.getElementById('btn-text').style.display = 'none';
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('generate-btn').disabled = true;
}

function hideLoading() {
    document.getElementById('btn-text').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('generate-btn').disabled = false;
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
}

function showSuccess(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
}

function hideMessages() {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('success-message').style.display = 'none';
}

function getTypeBadge(type) {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('boundary')) {
        return '<span class="type-badge type-boundary">boundary</span>';
    } else if (typeLower.includes('edge')) {
        return '<span class="type-badge type-edge">edge</span>';
    } else if (typeLower.includes('random')) {
        return '<span class="type-badge type-random">random</span>';
    } else {
        return '<span class="type-badge type-normal">normal</span>';
    }
}

function formatOutput(output) {
    const outputStr = String(output);
    if (outputStr.toLowerCase() === 'true') {
        return '<span class="output-true">True</span>';
    } else if (outputStr.toLowerCase() === 'false') {
        return '<span class="output-false">False</span>';
    } else {
        return outputStr;
    }
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results-container');
    const emptyState = document.getElementById('empty-state');
    
    currentResults = data;
    
    let html = '';
    
    // Add structured output section - handle new format
    const problem = data.problem || {};
    const testCases = data.test_cases || [];
    
    if (problem.title || problem.description || problem.input_format || problem.output_format) {
        html += `
            <div class="structured-output">
                <h4>📋 Problem Summary</h4>
                ${problem.title ? `
                    <div class="field">
                        <div class="field-label">Title</div>
                        <div class="field-value">${problem.title}</div>
                    </div>
                ` : ''}
                ${problem.description ? `
                    <div class="field">
                        <div class="field-label">Description</div>
                        <div class="field-value">${problem.description}</div>
                    </div>
                ` : ''}
                ${problem.input_format ? `
                    <div class="field">
                        <div class="field-label">Input Format</div>
                        <div class="field-value">${problem.input_format}</div>
                    </div>
                ` : ''}
                ${problem.output_format ? `
                    <div class="field">
                        <div class="field-label">Output Format</div>
                        <div class="field-value">${problem.output_format}</div>
                    </div>
                ` : ''}
                ${problem.constraints && problem.constraints.length > 0 ? `
                    <div class="field">
                        <div class="field-label">Constraints</div>
                        <div class="field-value">${problem.constraints.join(', ')}</div>
                    </div>
                ` : ''}
                ${problem.function_signature ? `
                    <div class="field">
                        <div class="field-label">Function Signature</div>
                        <div class="field-value">${problem.function_signature}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (testCases.length > 0) {
        html += `
            <table class="test-cases-table">
                <thead>
                    <tr>
                        <th>TYPE</th>
                        <th>INPUT</th>
                        <th>EXPECTED OUTPUT</th>
                        <th>EXPLANATION</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        testCases.forEach((testCase, index) => {
            const type = getTypeBadge(testCase.type || 'normal');
            const output = formatOutput(testCase.expected_output || testCase.output);
            
            html += `
                <tr>
                    <td>${type}</td>
                    <td>${testCase.input}</td>
                    <td>${output}</td>
                    <td>${testCase.explanation}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
    } else {
        // Fallback to JSON display if test_cases structure is different
        html += `
            <div class="json-output">${JSON.stringify(data, null, 2)}</div>
        `;
    }
    
    resultsContainer.innerHTML = html;
    emptyState.style.display = 'none';
}

function copyToClipboard() {
    if (!currentResults) {
        showError('No results to copy');
        return;
    }
    
    const text = JSON.stringify(currentResults, null, 2);
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Results copied to clipboard!');
        setTimeout(hideMessages, 3000);
    }).catch(() => {
        showError('Failed to copy results');
    });
}

function exportResults() {
    if (!currentResults) {
        showError('No results to export');
        return;
    }
    
    const dataStr = JSON.stringify(currentResults, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-cases-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess('Results exported successfully!');
    setTimeout(hideMessages, 3000);
}

function newSubmission() {
    addButtonAnimation(event.target);
    document.getElementById('dsa-question').value = '';
    document.getElementById('results-container').innerHTML = `
        <div id="empty-state" class="empty-state">
            <div class="empty-state-icon">🧪</div>
            <p>Generated test cases will appear here...</p>
        </div>
    `;
    hideMessages();
    currentResults = null;
}

document.getElementById('dsa-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const apiKey = document.getElementById('api-key').value.trim();
    const dsaQuestion = document.getElementById('dsa-question').value.trim();
    
    if (!apiKey || !dsaQuestion) {
        showError('Please fill in all fields');
        return;
    }
    
    // Add animation to submit button
    addButtonAnimation(document.getElementById('generate-btn'));
    
    hideMessages();
    showLoading();
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: apiKey,
                dsa_question: dsaQuestion
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.result);
            showSuccess('Test cases generated successfully!');
        } else {
            showError(data.error || 'An error occurred');
        }
        
    } catch (error) {
        showError('Network error: ' + error.message);
    } finally {
        hideLoading();
    }
});

// Load saved API key from localStorage
window.addEventListener('load', () => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        document.getElementById('api-key').value = savedApiKey;
    }
});

// Save API key to localStorage when changed
document.getElementById('api-key').addEventListener('input', (e) => {
    localStorage.setItem('gemini_api_key', e.target.value);
});


