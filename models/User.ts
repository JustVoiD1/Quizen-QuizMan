import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema ({
    email :  {type : String},
    name :  {type : String},
    password :  {type : String},
    role: {
        type : String,
        enum: ['teacher' , 'student'],
        required: true
    },

}, {
    timestamps : true
})

export default mongoose.models.User || mongoose.model('User', UserSchema);