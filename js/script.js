// ==========================================
// GEMMALYN BACUDO — Portfolio JavaScript
// ==========================================

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const githubContainer = document.getElementById('github-container');
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
const backToTop = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.querySelector('.nav-links');
const filterBtns = document.querySelectorAll('.filter-btn');

let allProjects = [];
let currentFilter = 'all';

// ==========================================
// THEME TOGGLE — Light/Dark Mode
// ==========================================
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
});

// ==========================================
// MOBILE MENU
// ==========================================
menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================
// LOAD PROJECTS from JSON
// ==========================================
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error('Could not load projects');
        allProjects = await response.json();
        displayProjects(allProjects);
    } catch (error) {
        console.error('Error:', error);
        if (projectsContainer) {
            projectsContainer.innerHTML = `
                <p class="error-msg">⚠️ Could not load projects. Please check back later.</p>
            `;
        }
    }
}

function displayProjects(projects) {
    if (!projectsContainer) return;
    projectsContainer.innerHTML = '';

    if (projects.length === 0) {
        projectsContainer.innerHTML = `<p class="error-msg">No projects found.</p>`;
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.category = project.category;

        const techHTML = project.technologies.map(t => `<span>${t}</span>`).join('');

        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tech-stack">${techHTML}</div>
            <p><strong>My Role:</strong> ${project.role}</p>
            ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">
                <i class="fab fa-github"></i> View on GitHub
            </a>` : ''}
            ${project.demo ? `<br><a href="${project.demo}" target="_blank" class="project-link">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : ''}
        `;
        projectsContainer.appendChild(card);
    });
}

// ==========================================
// PROJECT FILTERING
// ==========================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;

        const filtered = currentFilter === 'all'
            ? allProjects
            : allProjects.filter(p => p.category === currentFilter);

        displayProjects(filtered);
    });
});

// ==========================================
// LOAD GITHUB REPOS from API
// ==========================================
async function loadGitHubRepos() {
    const username = 'gemmalynbacudo'; // ← Change to YOUR GitHub username
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('GitHub API error');
        const repos = await response.json();
        displayGitHubRepos(repos);
    } catch (error) {
        console.error('GitHub Error:', error);
        if (githubContainer) {
            githubContainer.innerHTML = `
                <p class="error-msg">⚠️ Could not load GitHub repositories. Please check back later.</p>
            `;
        }
    }
}

function displayGitHubRepos(repos) {
    if (!githubContainer) return;
    githubContainer.innerHTML = '';

    if (repos.length === 0) {
        githubContainer.innerHTML = `<p class="error-msg">No public repositories found.</p>`;
        return;
    }

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
            <h3><i class="fab fa-github"></i> 
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </h3>
            <p>${repo.description || 'No description available.'}</p>
            <p><strong>Language:</strong> ${repo.language || 'Not specified'}</p>
            <p><strong>⭐ Stars:</strong> ${repo.stargazers_count} &nbsp; 
               <strong>🍴 Forks:</strong> ${repo.forks_count}</p>
        `;
        githubContainer.appendChild(card);
    });
}

// ==========================================
// CONTACT FORM — Validation
// ==========================================
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
        showFormMsg('Please enter your name.', 'error');
        return;
    }
    if (!emailRegex.test(email)) {
        showFormMsg('Please enter a valid email address.', 'error');
        return;
    }
    if (!message) {
        showFormMsg('Please write a message.', 'error');
        return;
    }

    showFormMsg('✅ Thank you! Your message has been sent successfully.', 'success');
    contactForm.reset();

    setTimeout(() => {
        formMsg.style.display = 'none';
    }, 5000);
});

function showFormMsg(text, type) {
    formMsg.textContent = text;
    formMsg.className = `form-message ${type}`;
    formMsg.style.display = 'block';
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadGitHubRepos();
    console.log('%c✨ Portfolio loaded successfully!', 'color: #6366F1; font-weight: bold; font-size: 14px;');
});
