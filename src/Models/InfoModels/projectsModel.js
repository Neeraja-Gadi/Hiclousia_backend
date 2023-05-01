const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const projectsSchema = new mongoose.Schema(
    {
        userDetailsID: {
            type: ObjectId,
            ref: "user"
        },
        projectTitle: {
            type: String,
            required: true
        },
        startDate: {
            type: String,
           
        },
        endDate: {
            type: String,
            
        },
        organizationName: {
            type: String,
      
        },
        description:{
            type: String,
        },
        Url:{
            type:String,
        }

    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Projects", projectsSchema);