document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.dataset.page;
    if (!pageType) return;

    fetch('../assets/data.json')
        .then(response => response.json())
        .then(data => {
            let items;
            let container;
            let cardGenerator;

            if (pageType === 'vibe-coding' || pageType === 'pre-singularity') {
                items = data[pageType];
                container = document.getElementById('project-grid');
                cardGenerator = createProjectCard;
            } else if (pageType === 'research') {
                items = data.research;
                container = document.getElementById('research-grid'); // Assumes research/index.html has a div with this ID
                cardGenerator = createResearchCard;
            }

            if (items && container) {
                container.innerHTML = ''; // Clear any placeholder content
                items.forEach(item => {
                    const card = cardGenerator(item);
                    container.innerHTML += card;
                });
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
            const container = document.getElementById('project-grid') || document.getElementById('research-grid');
            if (container) {
                container.innerHTML = '<p style="color: var(--gray);">Could not load items. Please try again later.</p>';
            }
        });
});

function createProjectCard(project) {
    // If detailUrl is '#', wrap the whole card in a non-linking div, else an <a>
    const wrapperTag = project.detailUrl && project.detailUrl !== '#' ? 'a' : 'div';
    
    return `
        <${wrapperTag} href="${project.detailUrl || '#'}" class="project-card-link">
            <div class="project-card fade-in">
                <div class="project-img" style="background-image: url(${project.imageUrl || ''}); background-size: cover; background-position: center;">
                    <!-- Fallback text if image doesn't load -->
                    <span style="background: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 5px;">${project.title}</span>
                </div>
                <h3 class="project-title">${project.subtitle}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    ${project.liveDemoUrl ? `<a href="${project.liveDemoUrl}">🔗 Live Demo</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}">💻 GitHub</a>` : ''}
                </div>
            </div>
        </${wrapperTag}>
    `;
}

function createResearchCard(topic) {
    const wrapperTag = topic.detailUrl && topic.detailUrl !== '#' ? 'a' : 'div';

    return `
        <${wrapperTag} href="${topic.detailUrl || '#'}" class="topic-card-link">
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