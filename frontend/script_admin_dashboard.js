
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

// PAGE GUARD 
(function () {
    const token = localStorage.getItem('authToken');

    // If there is no token, redirect to the login page
    if (!token) {
        window.location.href = 'admin_login.html';
        return; // Stop further execution
    }

    // This requires a small function to decode the token.
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // The 'exp' property is the expiration time in seconds
        if (payload.exp < Date.now() / 1000) {
            localStorage.removeItem('authToken'); // Clean up expired token
            window.location.href = 'admin_login.html';
        }
    } catch (e) {
        // If token is malformed, treat it as invalid
        localStorage.removeItem('authToken');
        window.location.href = 'admin_login.html';
    }
})(); // The () at the end makes this function run immediately

window.addEventListener('pageshow', function(event) {
    // The 'persisted' property is true if the page is from the bfcache
    if (event.persisted) {
        // When the page is restored from the cache, check for the token again
        const token = localStorage.getItem('authToken');
        if (!token) {
            // If the token is gone (because you logged out), force a full reload.
            // This reload will alsoe then trigger your Page Guard at the top of the script.
            window.location.reload();
        }
    }
});

window.onload = function () {
    const text = ['Allah', 'Mummy', 'Papa', 'My self obviously'];
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
                <div class="card-overlay">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>

            `            
            card.querySelector(".edit-btn").addEventListener('click', ()=>{
                openModal(project);
                console.log('Clicked on project:', project.title);
            });
            card.querySelector(".delete-btn").addEventListener('click', ()=>{
                deleteProject(project._id);
                console.log('Clicked on project:', project.title);
            });

            projectGrid.appendChild(card);
        });
        if (projects.length !== 0) {
            status.innerHTML = '';
            return;
        }
        // const addCard = document.createElement('div');
        // addCard.className = 'project-card';
        // addCard.innerHTML = `
        //     <img src="./images/add.jpg" alt="">
        // `
        // projectGrid.appendChild(addCard);
    } catch (error) {
        console.error("Could not fetch projects:", error);
        status.innerHTML = '<p style="color: white; text-align: center; font-weight: 500; margin: 10px;">Could not load projects. Please try again later.</p>';
    }
}

const modal = document.getElementById('project-modal');
const addProjectBtn = document.getElementById('add-project-btn');
const cancelBtn = document.getElementById('cancel-btn');
const projectGrid = document.querySelector(".project-grid");
const modalTitle = document.getElementById("modal-title");
const projectIdInput = document.getElementById("project-id");
const projectForm = document.getElementById("project-form");


function openModal(project = null){
    projectForm.reset();
    // Editing mode
    if(project)
    {
        modalTitle.textContent = "Edit Projet";
        projectIdInput.value = project._id;
        document.getElementById("title").value = project.title;
        document.getElementById("description").value = project.description;
        document.getElementById("imgUrl").value = project.imgUrl;
        document.getElementById("techStack").value = project.techStack.join(', ');
        document.getElementById("liveSiteUrl").value = project.liveSiteUrl;
        document.getElementById("githubUrl").value = project.githubUrl;
    }
    else
    {
        modalTitle.textContent = "Add a new Project";
        projectIdInput.value = '';
    }
    modal.showModal();
}

addProjectBtn.addEventListener('click', ()=> openModal())

cancelBtn.addEventListener('click', () => {
    modal.close(); 
});

projectForm.addEventListener('submit', async (event)=>{
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    const formData = new FormData(projectForm);
    const projectData = Object.fromEntries(formData.entries());

    const projectId = projectIdInput.value;
    projectData.techStack = projectData.techStack.split(', ').map(tech => tech.trim());
    const url = projectId ? `/api/project/${projectId}` : '/api/project';
    const method = projectId ? 'PUT' : 'POST';

    try {
        const apiUrl = 'https://devfolio-csm.onrender.com';
        const response = await fetch(`${apiUrl}` + url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            throw new Error("Failed to save project");            
        }
        modal.close();
        fetchAndDisplayProjets();
    } catch (error) {
        console.error("Save Error: ", error);
        alert('Could not save project.');
    }
});

async function deleteProject(projectId){
    if(!confirm("Are you sure you wnat to deldete this project?")) return;

    const token = localStorage.getItem("authToken");
    try {
        const apiUrl = 'https://devfolio-csm.onrender.com';
        const response = await fetch(`${apiUrl}/api/project/${projectId}`,{
            method: 'DELETE',
            headers:{
                'Authorization' : `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
        fetchAndDisplayProjets()
    } catch (error) {
        console.error('Delete error:', error);
        alert('Could not delete project.');
    }
}

document.querySelector(".log-out").addEventListener('click', ()=>{
    localStorage.removeItem('authToken');
    window.location.href = 'admin_login.html';
})
