// const { createElement } = require("react");

function typeWriter(word, delay, elementId) {
    const targetElement = document.getElementById(elementId);
    // targetElement.innerHTML = " "
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        let currentWord = word[wordIndex];
        if (isDeleting) {
            targetElement.textContent = currentWord.substring(0, charIndex - 1)
            charIndex--;
        }
        else {
            targetElement.textContent = currentWord.substring(0, charIndex + 1)
            charIndex++;
        }
        // If the word is fully typed
        if (!isDeleting && charIndex == currentWord.length) {
            isDeleting = true;
            setTimeout(type, delay * 20);
            return;
        }
        // If the word is fully deldeted
        if (isDeleting && charIndex == 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % word.length;
            setTimeout(type, delay * 5);
            return;
        }

        let typeSpeed = isDeleting ? delay / 2 : delay;
        setTimeout(type, typeSpeed)
    }
    type();
}

window.onload = function () {
    const text = ['Full-Stack Developer.', 'MERN Stack Specialist.', 'Problem Solver.'];
    // const statement = "Web Developer";
    typeWriter(text, 70, "type-writer");
    fetchAndDisplayProjets();
}

async function fetchAndDisplayProjets() {
    const projectGrid = document.querySelector('.project-grid');
    const status = document.getElementById('status-message');
    try {
        const apiUrl = 'https://devfolio-csm.onrender.com'; 
        const response = await fetch(`${apiUrl}/api/project`);
        if (!response.ok) {
            throw new Error(`HTTP error status : ${response.status}`);
        }
        const projects = await response.json();
        console.log("Projects data from server:", projects); 
        projectGrid.innerHTML = " ";
        
        if (projects.length === 0) {
            status.innerHTML = '<p style="color: white; text-align: center; font-weight: 500; margin: 10px;">No projects added yet</p>';
            return;
        }
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = 
            `
             <img src="${project.imgUrl}" alt="Screenshot of ${project.title}">
                    <div class="site-name">${project.title}</div>
            `            
            card.addEventListener('click', ()=>{
                openModal(project);
                console.log('Clicked on project:', project.title);
            });
            projectGrid.appendChild(card);

            // card.addEventListener('click', ()=>{
            //     openModal(project);
            // })
        });
    } catch (error) {
        console.error("Could not fetch projects:", error);
        status.innerHTML = '<p style="color: white; text-align: center; font-weight: 500; margin: 10px;">Could not load projects. Please try again later.</p>';
    }
}

const modal = document.getElementById("project-modal");
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openModal(project)
{
    const titleEl = document.getElementById("title");
    const descriptionEl = document.getElementById("description");
    const imgUrlEl = document.getElementById("imgUrl");
    const pillContainer = document.querySelector('.pills-tech');
    const linkContainer = document.querySelector('.links');

    titleEl.textContent = project.title;
    descriptionEl.textContent = project.description;

    imgUrlEl.src = project.imgUrl;
    imgUrlEl.alt = `Screenshot of ${project.title}`;

    imgUrlEl.addEventListener('click', ()=>{
        lightbox.style.display = 'block';
        lightboxImg.src = project.imgUrl;
    })

    pillContainer.innerHTML = ' ';

    if (Array.isArray(project.techStack)) {
        project.techStack.forEach(tech => {
            const pillElement = document.createElement('span');
            pillElement.className = 'pill';
            pillElement.textContent = tech;
            pillContainer.appendChild(pillElement);
        });
    }

    linkContainer.innerHTML = `<h3>Links</h3>`;

    if(project.liveSiteUrl){
        const livelink = document.createElement('a');
        livelink.className = 'liveSite';
        livelink.href = project.liveSiteUrl;
        livelink.target = '_blank';
        livelink.innerHTML = '🔗 View Live Site';
        linkContainer.appendChild(livelink);
    }
    if(project.githubUrl){
        const githubLink = document.createElement('a');
        githubLink.className = 'githubLink';
        githubLink.href = project.githubUrl;
        githubLink.target = '_blank';
        githubLink.innerHTML = '🔗 View on GitHub';
        linkContainer.appendChild(githubLink);
    }
    modal.showModal();
}

document.getElementById("cancel-btn").addEventListener('click', ()=>{
    modal.close();
})

lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
    lightbox.style.display = 'none';
});
