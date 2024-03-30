const express = require('express');
const router = express.Router();
const customercontroller = require('../controllers/customercontroller');

router.get('/',customercontroller.homepage);
router.get('/about',customercontroller.about);
router.get('/add',customercontroller.addcustomer);
router.post('/add',customercontroller.postcustomer);
router.get('/view/:id',customercontroller.view);
router.get('/edit/:id',customercontroller.edit);
router.put('/edit/:id',customercontroller.editpost);
router.delete('/edit/:id',customercontroller.deletecustomer);
router.post('/search',customercontroller.searchcustomer);




module.exports = router;