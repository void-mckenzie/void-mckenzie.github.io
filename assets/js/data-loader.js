// A helper function to print messages directly onto the webpage for easy debugging.
function logToPage(message, isError = false) {
    const logContainer = document.getElementById('debug-log');
    if (logContainer) {
        const p = document.createElement('p');
        p.textContent = message;
        if (isError) {
            p.style.color = '#f87171'; // A reddish color for errors.
            p.style.fontWeight = 'bold';
        }
        logContainer.appendChild(p);
    }
    // Also log to the console as a backup.
    if (isError) {
        console.error(message);
    } else {
        console.log(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    logToPage('EVENT: DOMContentLoaded fired. Script is running.');

    const pageType = document.body.dataset.page;
    if (!pageType) {
        logToPage('HALT: No "data-page" attribute found on the <body> tag.', true);
        return;
    }
    logToPage(`STEP 1: Found page type: "${pageType}"`);

    // **THE CRITICAL FIX IS HERE**
    // We map the HTML kebab-case attribute to the JSON camelCase key.
    const keyMap = {
        'vibe-coding': 'vibeCoding',
        'pre-singularity': 'preSingularity',
        'research': 'research' 
    };
    const dataKey = keyMap[pageType];
    
    if (!dataKey) {
        logToPage(`HALT: The page type "${pageType}" is not a recognized key.`, true);
        return;
    }
    logToPage(`STEP 2: Mapped to JSON key: "${dataKey}"`);

    const containerId = (pageType === 'research') ? 'research-grid' : 'project-grid';
    const container = document.getElementById(containerId);

    if (!container) {
        logToPage(`HALT: Cannot find the container element with ID: "#${containerId}" in the HTML.`, true);
        return;
    }
    logToPage(`STEP 3: Found HTML container: "#${containerId}"`);

    logToPage('STEP 4: Fetching data from ../assets/data.json...');
    fetch('../assets/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            logToPage('SUCCESS: data.json file found and fetched.');
            return response.json();
        })
        .then(data => {
            logToPage('SUCCESS: data.json parsed successfully.');
            const items = data[dataKey];

            if (!items) {
                logToPage(`HALT: The key "${dataKey}" does not exist in your data.json file.`, true);
                return;
            }
            logToPage(`STEP 5: Found ${items.length} item(s) for key "${dataKey}".`);
            
            container.innerHTML = ''; // Clear loading message.
            items.forEach(item => {
                const cardGenerator = (pageType === 'research') ? createResearchCard : createProjectCard;
                const cardHTML = cardGenerator(item);
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
            logToPage(`COMPLETE: Successfully generated and displayed ${items.length} cards.`);
            
            // Optionally hide the debug log on success after a delay
            setTimeout(() => { 
                const logContainer = document.getElementById('debug-log');
                if (logContainer) logContainer.style.display = 'none';
            }, 5000);

        })
        .catch(error => {
            logToPage(`FATAL ERROR: ${error.message}`, true);
        });
});

// The createProjectCard and createResearchCard functions remain the same as before.
// ... (You can paste them here from the previous response)
function createProjectCard(project) {
    const isLink = project.detailUrl && project.detailUrl !== '#';
    const wrapperTag = isLink ? 'a' : 'div';
    const hrefAttr = isLink ? `href="${project.detailUrl}"` : '';
    
    return `
        <${wrapperTag} ${hrefAttr} class="project-card-link">
            <div class="project-card fade-in">
                <div class="project-img" style="background-image: url(${project.imageUrl || ''}); background-size: cover; background-position: center;">
                    <span style="background: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 5px;">${project.title}</span>
                </div>
                <h3 class="project-title">${project.subtitle}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    ${project.liveDemoUrl ? `<a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer">🔗 Live Demo</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">💻 GitHub</a>` : ''}
                </div>
            </div>
        </${wrapperTag}>
    `;
}

function createResearchCard(topic) {
    const isLink = topic.detailUrl && topic.detailUrl !== '#';
    const wrapperTag = isLink ? 'a' : 'div';
    const hrefAttr = isLink ? `href="${topic.detailUrl}"` : '';

    return `
        <${wrapperTag} ${hrefAttr} class="topic-card-link">
            <div class="topic-card fade-in">
                <div class="topic-icon">🔬</div>
                <h3>${topic.title}</h3>
                <p>${topic.description}</p>
                <ul class="paper-list">
                    ${topic.keyPapers.map(paper => `<li>${paper}</li>`).join('')}
                </ul>
            </div>
        </${wrapperTag}>
    `;
}