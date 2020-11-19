const express = require('express');

const Schemes = require('./scheme-model.js');

const router = express.Router();

//GET all scheme
router.get('/', (req, res) => {
  Schemes.find()
    .then(schemes => {
      res.json(schemes);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get schemes' });
    });
});

//GET scheme by id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  Schemes.findById(id)
    .then(scheme => {
      if (scheme) {
        res.json(scheme);
      } else {
        res.status(404).json({ message: 'Could not find scheme with given id.' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get schemes' });
    });
});

//GET step by scheme id
router.get('/:id/steps', (req, res) => {
  const { id } = req.params;

  Schemes.findSteps(id)
    .then(steps => {
      if (steps.length) {
        res.json(steps);
      } else {
        res.status(404).json({ message: 'Could not find steps for given scheme' })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to get steps' });
    });
});
//POST new scheme
router.post('/', (req, res) => {
  const schemeData = req.body;

  Schemes.add(schemeData)
    .then(scheme => {
      if (scheme) {
        res.status(201).json(scheme);
      } else {
        res.status(400).json({
          message: `please insert scheme_name!`
        })
      }
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ 
        message: 'Failed to create new scheme', 
        error: err
      });
    });
});

//POST new step
router.post('/:id/steps', (req, res) => {
  const stepData = req.body;
  const { id } = req.params;

  Schemes.findById(id)
    .then(scheme => {
      if (scheme) {
        return Schemes.addStep(stepData, id);
      } else {
        res.status(404).json({ message: 'Could not find scheme with given id.' })
      }
    })
    .then(step => {
      res.status(201).json(step);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Failed to create new step' });
    });
});

//PUT scheme
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Schemes.findById(id)
    .then(scheme => {
      if (scheme) {
        return Schemes.update(changes, id);
      } else {
        res.status(404).json({ message: 'Could not find scheme with given id' });
      }
    })
    .then(updatedScheme => {
      res.json(updatedScheme);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to update scheme' });
    });
});

//DELETE scheme by id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Schemes.remove(id)
    .then(deleted => {
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find scheme with given id' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete scheme' });
    });
});

module.exports = router;
