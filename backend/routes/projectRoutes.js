const express = require("express");
const Project = require("../models/projectModel");
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

router.get('/', async (req, res)=>{
    try {
        const projects = await Project.find({});
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({message: "Server Error!"})
    }
});

router.post('/', protect, async(req, res)=>{
    try {
        const {title, description, imgUrl, techStack, liveSiteUrl, githubUrl} = req.body;
        const project = new Project({
            title, description, imgUrl, techStack, liveSiteUrl, githubUrl
        });
        const createdProject = await project.save();
        res.status(200).json(createdProject);
    } catch (error) {
        res.status(500).json({ mesage: "Server Error" });
    }
});

router.put('/:id', protect, async(req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.title = req.body.title || project.title;
            project.description = req.body.description || project.description;
            project.imgUrl = req.body.imgUrl || project.imgUrl;
            project.techStack = req.body.techStack || project.techStack;
            project.liveSiteUrl = req.body.liveSiteUrl || project.liveSiteUrl;
            project.githubUrl = req.body.githubUrl || project.githubUrl;

            const updatedProject = await project.save();
            res.status(400).json(updatedProject);
        }
        else
        {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating project' });
    }
});

router.delete('/:id', protect, async(req, res) =>{
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if(project)
        {
            res.json({ message: 'Project removed' });
        }
        else
        {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting project" });
    }
})

module.exports = router;