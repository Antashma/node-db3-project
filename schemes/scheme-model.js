//NOTE: 'id' is scheme id
const { count } = require('../data/db-config');
const db = require('../data/db-config')

module.exports = {
    find,
    findById,
    findSteps,
    addStep,
    add,
    update,
    remove
}

async function find() {
    return await db('schemes');
}


async function findById(id) {
    try {
        const scheme = await db('schemes').where({id}).first();
        if (!scheme) {
            return Promise.resolve(null)
        } else {
            return scheme;
        }
    } catch (err) {
        throw err
    } 
}

async function findSteps(id) {
    try {
        const stepsBySchemeId = await db('steps as st')
            .where({scheme_id : id})
            .join('schemes as sc', 'st.scheme_id', 'sc.id')
            .select('st.id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
            .orderBy('st.step_number')
        
        return stepsBySchemeId;

    } catch (error) {
        throw error
    }
    
}


async function addStep(newStep, id) {
    try {
        const currentSteps =  await db('steps').count('*').where({scheme_id:id}).first()
        const nextStepNum = currentSteps['count(*)'] + 1;

        const step =  await db('steps').insert({...newStep, scheme_id:id, step_number: nextStepNum})
        return step;
    } catch (error) {
        throw error;
    }
}


async function add(newScheme) {
    try {
        const ids = await db('schemes').insert(newScheme);
/* The above Knex code returns an array of ID's of newly created objects. We only created one obj, so this array has a length of 1. So, this variable below will hold the new scheme object that was created by using the findById method. */ 
        const createdScheme = await findById(ids[0])
        return createdScheme;
    } catch (error) {
        throw error;
    }
}


async function update(changes, id) {
 try {
     await db('schemes').where({id}).update({...changes})
     const updatedScheme = await findById(id)
     return updatedScheme;
 } catch (error) {
     throw error
 }
}


async function remove(id) {
    const deletedScheme = await findById(id);
    try {
        if (findById(id)) {
            await db('schemes').where({id}).del()
            return deletedScheme;
        } else {
            return Promise.resolve(null);
        }
    } catch (error) {
        throw error
    }
}