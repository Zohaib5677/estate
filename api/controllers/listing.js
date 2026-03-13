import Listing from '../models/listing.js'; 

export const createListing =async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getuserlistings=async (req,res)=>{
    try {
        if(req.user.id===req.params.id)
        {
             const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        }
           
        else{
            res.status(403).json({ message: "Unauthorized access" });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const deleteListing=async (req,res)=>{
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Listing deleted successfully" });
    }
        catch (error) {
        res.status(400).json({ message: error.message });
    }
}