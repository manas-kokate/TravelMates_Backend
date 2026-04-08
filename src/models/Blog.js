import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 100,
        },

        story: {
            type: String,
            required: true,
        },

        images: [
            {
                url: String,
                public_id: String,
            },
        ],

        coverImage: String,

        location: {
            type: String, // city / landmark
        },

        category: {
            type: String,
            enum: [
                "Trek Diary",
                "Food Journey",
                "Culture Trail",
                "Island Hopping",
                "Road Trip",
                "City Break",
                "Wildlife",
                "Budget Travel",
            ],
        },

        tags: {
            type: [String],
            validate: [(val) => val.length <= 8, "Max 8 tags allowed"],
        },

        tripMood: {
            type: String,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);