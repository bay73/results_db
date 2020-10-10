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
    var contest = null;
    if (req.params.id) {
      const result = await db.query('SELECT ct.name, c.label, c.host_city, c.host_country FROM contests c, contest_types ct WHERE ct.id = c.contest_typeid and c.id = ?', req.params.id);
      if (result.length != 0) {
        contest = transformRawList(result)[0];
      }
      if (contest) {
        results = await db.query('SELECT p.id, p.name, c.country, t.team, r.official_rank, r.unofficial_rank, r.points'+
                                  ' FROM results r, participants p, countries c, teams t '+
                                 ' WHERE r.contest_id = ? AND p.id = r.participant_id AND t.id = r.team_id AND c.id = p.countryid', req.params.id);
        teamResults = await db.query('SELECT t.id, t.team, r.official_rank, r.unofficial_rank, r.points'+
                                  ' FROM team_results r, teams t '+
                                 ' WHERE r.contest_id = ? AND t.id = r.team_id', req.params.id);
      }
    }
    res.render('championship',
      {
         contest: contest,
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
    var participant = null;
    if (req.params.id) {
      const result = await db.query('SELECT name FROM participants WHERE id = ?', req.params.id);
      if (result.length != 0) {
        participant = transformRawList(result)[0];
      }
      if (participant) {
        results = await db.query('SELECT c.id, ct.name, c.label, r.official_rank,  r.unofficial_rank, r.points'+
                                  ' FROM results r, contests c, contest_types ct '+
                                 ' WHERE r.participant_id = ? AND c.id = r.contest_id AND ct.id = c.contest_typeid', req.params.id);
      }
    }
    res.render('participant',
      {
         participant: participant,
      	 countries: transformRawList(countries),
      	 participants: transformRawList(participants),
      	 results: transformRawList(results),
      });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
