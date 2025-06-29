document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the page type from the <body> tag's data-page attribute.
    const pageType = document.body.dataset.page;
    if (!pageType) {
        // If no data-page is set, do nothing.
        return; 
    }

    // 2. Fetch the central data source. The path is relative to the HTML file.
    fetch('../assets/data.json')
        .then(response => {
            // **IMPROVEMENT**: Check if the fetch request was successful (e.g., not a 404 error).
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - Could not find data.json`);
            }
            // If successful, parse the JSON data.
            return response.json();
        })
        .then(data => {
            let items;
            let container;
            let cardGenerator;

            // 3. Determine which data array to use based on the page type.
            if (pageType === 'vibe-coding' || pageType === 'pre-singularity') {
                items = data[pageType]; // e.g., data['vibe-coding']
                container = document.getElementById('project-grid');
                cardGenerator = createProjectCard;
            } else if (pageType === 'research') {
                items = data.research;
                container = document.getElementById('research-grid');
                cardGenerator = createResearchCard;
            }

            // 4. Check if we found both the data array and the container div in the HTML.
            if (items && container) {
                container.innerHTML = ''; // Clear any loading messages or placeholders.
                items.forEach(item => {
                    const cardHTML = cardGenerator(item);
                    container.insertAdjacentHTML('beforeend', cardHTML);
                });
            } else {
                // **IMPROVEMENT**: Log a specific error if data or container is missing.
                console.error(`Error: Could not find data for pageType "${pageType}" in data.json, or the target container element was not found in the HTML.`);
                if(container) {
                    container.innerHTML = `<p style="color: var(--gray);">Error: Content data is missing or invalid.</p>`
                }
            }
        })
        .catch(error => {
            // **IMPROVEMENT**: Catch any errors from the fetch/parsing process and display them.
            console.error('Error loading or processing data:', error);
            const container = document.getElementById('project-grid') || document.getElementById('research-grid');
            if (container) {
                container.innerHTML = `<p style="color: var(--gray);">Could not load items. Please check the console for details.</p>`;
            }
        });
});

/**
 * Creates the HTML string for a single project card.
 * @param {object} project - The project object from data.json.
 * @returns {string} The HTML for the project card.
 */
function createProjectCard(project) {
    // If detailUrl is '#' or missing, the card won't be a link.
    const isLink = project.detailUrl && project.detailUrl !== '#';
    const wrapperTag = isLink ? 'a' : 'div';
    const hrefAttr = isLink ? `href="${project.detailUrl}"` : '';
    
    return `
        <${wrapperTag} ${hrefAttr} class="project-card-link">
            <div class="project-card fade-in">
                <div class="project-img" style="background-image: url(${project.imageUrl || ''}); background-size: cover; background-position: center;">
                    <!-- Fallback text inside a semi-transparent box -->
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

/**
 * Creates the HTML string for a single research topic card.
 * @param {object} topic - The research topic object from data.json.
 * @returns {string} The HTML for the research card.
 */
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