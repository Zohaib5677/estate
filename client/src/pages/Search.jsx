import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import axios from "axios";

export default function Search() {

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  // FETCH LISTINGS
  useEffect(() => {

    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {

      setLoading(true);
      setShowMore(false);

      const searchQuery = urlParams.toString();

      try {

              
       const res = await axios.get(
                `http://localhost:3000/api/listings/get?${searchQuery}`,
                { withCredentials: true }
              );
        const data = await res.data;
        setListings(data);

        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }

      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchListings();

  }, [location.search]);

  // HANDLE CHANGE
  const handleChange = (e) => {
 if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }


    if (e.target.id === "sort_order") {

      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];

      setSidebarData({ ...sidebarData, sort, order });

    }
  };

  // SEARCH SUBMIT
  const handleSubmit = (e) => {

    e.preventDefault();

    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);

  };

  // SHOW MORE
  const onShowMoreClick = async () => {

    const startIndex = listings.length;

    const urlParams = new URLSearchParams(location.search);

    urlParams.set("startIndex", startIndex);

    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/listing/get?${searchQuery}`);

    const data = await res.json();

    setListings([...listings, ...data]);

    if (data.length < 9) {
      setShowMore(false);
    }

  };

  return (
    <div className="flex flex-col md:flex-row">

      {/* SIDEBAR */}

      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          <div className="flex items-center gap-2">
            <label className="font-semibold">Search:</label>

            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* TYPE */}

          <div className="flex gap-2 flex-wrap items-center">

            <label className="font-semibold">Type:</label>

            <input
              type="checkbox"
              id="all"
              checked={sidebarData.type === "all"}
              onChange={handleChange}
            /> All

            <input
              type="checkbox"
              id="rent"
              checked={sidebarData.type === "rent"}
              onChange={handleChange}
            /> Rent

            <input
              type="checkbox"
              id="sale"
              checked={sidebarData.type === "sale"}
              onChange={handleChange}
            /> Sale

            <input
              type="checkbox"
              id="offer"
              checked={sidebarData.offer}
              onChange={handleChange}
            /> Offer

          </div>

          {/* AMENITIES */}

          <div className="flex gap-4">

            <label className="font-semibold">Amenities:</label>

            <input
              type="checkbox"
              id="parking"
              checked={sidebarData.parking}
              onChange={handleChange}
            /> Parking

            <input
              type="checkbox"
              id="furnished"
              checked={sidebarData.furnished}
              onChange={handleChange}
            /> Furnished

          </div>

          {/* SORT */}

          <div className="flex items-center gap-2">

            <label className="font-semibold">Sort:</label>

            <select
              id="sort_order"
              onChange={handleChange}
              className="border p-3 rounded-lg"
              defaultValue="createdAt_desc"
            >
              <option value="regularPrice_desc">Price High → Low</option>
              <option value="regularPrice_asc">Price Low → High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>

          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg">
            Search
          </button>

        </form>

      </div>

      {/* RESULTS */}

      <div className="flex-1">

        <h1 className="text-3xl font-semibold border-b p-3 mt-5">
          Listing Results
        </h1>

        <div className="p-7 flex flex-wrap gap-4">

          {!loading && listings.length === 0 && (
            <p>No listing found</p>
          )}

          {loading && <p>Loading...</p>}

          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline w-full"
            >
              Show more
            </button>
          )}

        </div>

      </div>

    </div>
  );
}