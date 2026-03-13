import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { uploadImage } from "../utils/cloudinaryUpload";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdateListing() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const params = useParams();
    const [loading, setloading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        console.log("Fetching listing with ID:", params.listingId);
        const fetchListing = async () => {
            try {
               const res = await axios.get(
  `http://localhost:3000/api/listings/listings/${params.listingId}`,
  { withCredentials: true }
);
                if (res.status === 200) {
                    setFormData(res.data);
                }
                else {
                    toast.error("Failed to fetch listing. Please try again.");
                }
            }
            catch (error) {
                toast.error("Failed to fetch listing. Please try again.");
                console.log(error);
            }
        };
            
fetchListing();
        }, []);


    const handleImageSubmit = async () => {
        setUploading(true);
        try {
            if (files.length === 0)
                return toast.error("Please select at least one image");

            const urls = [];
            for (let i = 0; i < files.length; i++) {
                const url = await uploadImage(files[i]);
                urls.push(url);
            }
            setUploading(false);
            toast.success("Images uploaded successfully!");
            setFormData({
                ...formData,
                imageUrls: [...formData.imageUrls, ...urls],
            });
            console.log("Uploaded Image URLs:", imageUrlsurls);
        } catch (error) {
            setUploading(false);
            toast.error("Image upload failed. Please try again.");
        }
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === "sale" || e.target.id === "rent") {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === "parking" ||
            e.target.id === "furnished" ||
            e.target.id === "offer"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === "number" ||
            e.target.type === "text" ||
            e.target.tagName === "TEXTAREA"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);

        try {
            
            if (formData.imageUrls.length < 1) {
                setError("Upload at least one image");
                toast.error("Upload at least one image");
            }

            if (+formData.regularPrice < +formData.discountPrice) {
                setError("Discount must be lower than regular price");
                toast.error("Discount must be lower than regular price");
            }
            const res = await axios.put(`http://localhost:3000/api/listings/update/${params.listingId}`, formData, { withCredentials: true });
            console.log("API Response:", res.data);
            if (res.status === 200) {
                toast.success("Listing updated successfully!");
               
            }

            setloading(false);
        } catch (error) {
            setError("Validation failed. Please check your inputs.");
            setloading(false);
            toast.error("Validation failed. Please check your inputs.");
        }
        console.log("Listing Data:", formData);

    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Update A Listing
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                {/* LEFT SIDE */}
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Name"
                        id="name"
                        required
                        className="border p-3 rounded-lg"
                        onChange={handleChange}
                        value={formData.name}
                    />

                    <textarea
                        placeholder="Description"
                        id="description"
                        className="border p-3 rounded-lg"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        id="address"
                        className="border p-3 rounded-lg"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    {/* CHECKBOXES */}

                    <div className="flex gap-6 flex-wrap">
                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                onChange={handleChange}
                                checked={formData.type === "sale"}

                            />
                            Sell
                        </label>

                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                onChange={handleChange}
                                checked={formData.type === "rent"}
                            />
                            Rent
                        </label>

                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            Parking
                        </label>

                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            Furnished
                        </label>

                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            Offer
                        </label>
                    </div>

                    {/* NUMBERS */}

                    <div className="flex flex-wrap gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mt-1">Bedrooms</p>
                            <input
                                type="number"
                                id="bedrooms"
                                min="1"
                                max="10"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mt-1">Bathrooms</p>
                            <input
                                type="number"
                                id="bathrooms"
                                min="1"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mt-1">Regular Price</p>
                            <input
                                type="number"
                                id="regularPrice"
                                min="50"
                                max="750000000"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                        </div>

                        {formData.offer && (
                            <div>
                                <p className="text-sm text-gray-600 mt-1">Discount Price</p>
                                <input
                                    type="number"
                                    id="discountPrice"
                                    min="0"
                                    max="750000000"
                                    className="border p-3 rounded-lg"
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE */}

                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images (max 6)</p>

                    <div className="flex gap-4">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="border p-3 rounded w-full"
                            onChange={(e) => setFiles(e.target.files)}
                        />

                        <button
                            type="button"
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className="p-3 border border-green-700 text-green-700 rounded"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>

                    {/* PREVIEW */}

                    {formData.imageUrls.map((url, index) => (
                        <div
                            key={index}
                            className="flex justify-between border p-3 items-center"
                        >
                            <img
                                src={url}
                                alt="preview"
                                className="w-20 h-20 object-cover rounded"
                            />

                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))}

                    <button disabled={loading} className="p-3 bg-slate-700 text-white rounded-lg">
                        {loading ? "loading..." : "Update listing"}
                    </button>

                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
}
