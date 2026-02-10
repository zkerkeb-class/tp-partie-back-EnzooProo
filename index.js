
import express from 'express';
import cors from 'cors';
import pokemon from './schema/pokemon.js';
import team from './schema/team.js';

import './connect.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// GET pokemons with pagination
app.get('/pokemons', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const pokemons = await pokemon.find({}).skip(skip).limit(limit);
        const total = await pokemon.countDocuments();

        res.json({
            data: pokemons,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET pokemon by name
app.get('/pokemons/name/:name', async (req, res) => {
    try {
        const name = req.params.name;
        // Search in french name by default, or could search in all
        const poke = await pokemon.findOne({
            $or: [
                { 'name.french': { $regex: new RegExp(name, 'i') } },
                { 'name.english': { $regex: new RegExp(name, 'i') } }
            ]
        });
        if (poke) {
            res.json(poke);
        } else {
            res.status(404).send('Pokemon not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET pokemon by ID
app.get('/pokemons/:id', async (req, res) => {
    try {
        const poke = await pokemon.findOne({ id: req.params.id });
        if (poke) {
            res.json(poke);
        } else {
            res.status(404).send('Pokemon not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST Create a pokemon
app.post('/pokemons', async (req, res) => {
    try {
        const lastPokemon = await pokemon.findOne().sort({ id: -1 });
        const newId = lastPokemon ? lastPokemon.id + 1 : 1;
        
        const newPokemon = new pokemon({
            ...req.body,
            id: newId
        });
        await newPokemon.save();
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// PUT Update a pokemon
app.put('/pokemons/:id', async (req, res) => {
    try {
        const updatedPokemon = await pokemon.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (updatedPokemon) {
            res.json(updatedPokemon);
        } else {
            res.status(404).send('Pokemon not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// DELETE a pokemon
app.delete('/pokemons/:id', async (req, res) => {
    try {
        const deletedPokemon = await pokemon.findOneAndDelete({ id: req.params.id });
        if (deletedPokemon) {
            res.json({ message: 'Pokemon deleted successfully' });
        } else {
            res.status(404).send('Pokemon not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// TEAMS ROUTES

// GET all teams
app.get('/teams', async (req, res) => {
    try {
        const teams = await team.find().populate('members');
        res.json(teams);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET team by ID
app.get('/teams/:id', async (req, res) => {
    try {
        const t = await team.findById(req.params.id).populate('members');
        if (t) {
            res.json(t);
        } else {
            res.status(404).send('Team not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST Create a team
app.post('/teams', async (req, res) => {
    try {
        const newTeam = new team(req.body);
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});