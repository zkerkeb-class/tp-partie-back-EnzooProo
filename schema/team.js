import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pokemon'
    }]
}, {
    timestamps: true
});

// Limiter à 6 membres
teamSchema.path('members').validate(function(value) {
    return value.length <= 6;
}, 'Une équipe ne peut pas avoir plus de 6 Pokémon.');

export default mongoose.model("team", teamSchema);
