const express = require('express');
const router = express.Router();
const db = require('./db');

router.get(['/','/championship'], (req, res) => {
  res.redirect('championship/1');
});

router.get('/participant', (req, res) => {
  res.redirect('participant/1');
});


function transformRawList(list) {
  return list.map(rawObject => Object.assign({}, rawObject));
}

router.get('/championship/:id', async (req, res, next) => {
  try {
    const types = await db.query('SELECT * FROM contest_types');
    const contests = await db.query('SELECT * FROM contests');
    var results = [];
    if (req.params.id) {
      results = await db.query('SELECT p.name, c.country, r.official_rank,  r.unofficial_rank, r.points'+
                                ' FROM results r, participants p, countries c '+
                               ' WHERE r.contest_id = ? AND p.id = r.participant_id AND c.id = p.countryid', req.params.id);
    }
    res.render('championship',
      {
      	 types: transformRawList(types),
      	 contests: transformRawList(contests),
      	 results: transformRawList(results),
      });
  } catch (e) {
    next(e);
  }
});

router.get('/participant/:id', async (req, res, next) => {
  try {
    const countries = await db.query('SELECT * FROM countries');
    const participants = await db.query('SELECT * FROM participants');
    var results = [];
    if (req.params.id) {
      results = await db.query('SELECT ct.name, c.label, r.official_rank,  r.unofficial_rank, r.points'+
                                ' FROM results r, contests c, contest_types ct '+
                               ' WHERE r.participant_id = ? AND c.id = r.contest_id AND ct.id = c.contest_typeid', req.params.id);
    }
    res.render('participant',
      {
      	 countries: transformRawList(countries),
      	 participants: transformRawList(participants),
      	 results: transformRawList(results),
      });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
