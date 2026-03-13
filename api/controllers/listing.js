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
export const updateListing=async (req,res)=>{
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return res.status(404).json({ message: "Listing not found" });
        }
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedListing);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}    
export const listing=async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).json(listing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};    