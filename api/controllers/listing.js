import Listing from '../models/listing.js'; 

export const createListing =async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
