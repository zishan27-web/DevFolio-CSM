const mongoose  = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: [true, "Please provide the project name"], 
            trim: true,
        },
        description:{
            type: String,
            required: [true, "Please provide the description of the project"], 
        },
        imgUrl:{
            type: String,
            required: true,
        },
        techStack:{
            type: [String],
        },
        liveSiteUrl:{
            type: String,
        }, 
        githubUrl:{
            type: String,
        }
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model('Project', projectSchema)

module.exports = Project;