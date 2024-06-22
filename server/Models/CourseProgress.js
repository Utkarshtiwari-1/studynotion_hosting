const mongoose = require("mongoose");

const couseprogschema = new mongoose.Schema({
    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    completedVideos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }],
});

module.exports = mongoose.model("CourseProgress",couseprogschema);