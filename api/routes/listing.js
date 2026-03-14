import  express from 'express';
import {getListings,getUser,createListing,getuserlistings,deleteListing,updateListing ,listing}
 from '../controllers/listing.js';
 import { verifyToken } from '../controllers/auth.js';
const router=express.Router();

router.get('/get',getListings);
router.post('/create', createListing);
router.get('/getlistings/:id',verifyToken,getuserlistings);
router.delete('/deletelisting/:id', deleteListing);
router.put('/update/:id',updateListing);
router.get('/listings/:id', listing);
router.get('/:id', verifyToken, getUser)

export default router