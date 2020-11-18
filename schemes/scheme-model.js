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
        return await db('schemes').where({id}).first();
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

}


async function update(id, changes) {

}


async function remove(id) {

}