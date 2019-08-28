const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database');

router.get('/', isLoggedIn, async (req, res) => {
    const newopinions = await pool.query('SELECT * FROM opinions WHERE user_id = ?', [req.user.user_id]);
    res.render('opinions/list', {newopinions});
});

router.get('/add', isLoggedIn, (req, res) => {
    res.render('opinions/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const {title, description} = req.body;
    const newLink = {
        title,
        description,
        user_id: req.user.user_id
    };
    await pool.query('INSERT INTO opinions SET ?', [newLink]);
    req.flash('success', 'Link saved successfully');
    res.redirect('/opinions');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const {id}  = req.params;   
    const editLink = await pool.query('SELECT * FROM opinions WHERE opinion_id = ?', [id]);
    res.render('opinions/edit', editLink[0]);
});

router.post('/edit/:id', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const {title, description } = req.body;
    const newLink = {
        title,
        description
    }
    pool.query('UPDATE opinions SET ? WHERE opinion_id = ?', [newLink, id]);
    req.flash('success', 'Link update successfully');
    res.redirect('/opinions');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const {id}  = req.params;
    await pool.query('DELETE FROM opinions WHERE opinion_id = ?', [id]);
    req.flash('success', 'Link deleted successfully');
    res.redirect('/opinions');
});

module.exports = router;