import mongoose from 'mongoose';
import fs from 'fs';
import pokemon from './schema/pokemon.js';
import './connect.js';

const seedDB = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('./data/pokemons.json', 'utf8'));
        
        // Check if database is already seeded
        const count = await pokemon.countDocuments();
        if (count > 0) {
            console.log('Database already has data. Skipping seed.');
            process.exit(0);
        }

        await pokemon.insertMany(data);
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Wait a bit for connection
setTimeout(seedDB, 2000);
