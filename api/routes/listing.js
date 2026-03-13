import  express from 'express';
import { createListing,getuserlistings,deleteListing,updateListing ,listing}
 from '../controllers/listing.js';
 import { verifyToken } from '../controllers/auth.js';
const router=express.Router();

router.post('/create', createListing);
router.get('/getlistings/:id',verifyToken,getuserlistings);
router.delete('/deletelisting/:id', deleteListing);
router.put('/update/:id',updateListing);
router.get('/listings/:id', listing);
export default router