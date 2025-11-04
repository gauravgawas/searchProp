import React, { useCallback, useState } from "react";

export default function Filters(props: any) {
  const [isOpen, setIsOpen] = useState(true); // toggle filter visibility

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    props.setFilter({
      ...props.filter,
      [id]: value,
    });
  };

  const handlePriceCheckbox = (range: any) => {
    props.setFilter({
      ...props.filter,
      Price: range,
    });
  };

  const handleAreaCheckbox = (range: any) => {
    props.setFilter({
      ...props.filter,
      Area: range,
    });
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      props.handleSearch();
      setIsOpen(false);
    },
    [props.filter]
  );

  // Price Ranges (₹)
  const priceRanges = [
    { label: "Below ₹25 Lakh", min: 0, max: 2500000 },
    { label: "₹25 L – ₹50 L", min: 2500000, max: 5000000 },
    { label: "₹50 L – ₹1 Cr", min: 5000000, max: 10000000 },
    { label: "₹1 Cr – ₹5 Cr", min: 10000000, max: 50000000 },
    { label: "Above ₹5 Cr", min: 50000000, max: Infinity },
  ];

  // Area Ranges (sqft)
  const areaRanges = [
    { label: "Below 500 sqft", min: 0, max: 500 },
    { label: "500 – 1000 sqft", min: 500, max: 1000 },
    { label: "1000 – 1500 sqft", min: 1000, max: 1500 },
    { label: "1500 – 2500 sqft", min: 1500, max: 2500 },
    { label: "2500 – 5000 sqft", min: 2500, max: 5000 },
    { label: "Above 5000 sqft", min: 5000, max: Infinity },
  ];

  return (
    <div className="">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex  bg-primary text-white px-4 py-2 rounded float-end"
      >
        Filters
        <span className="text-xl">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Collapsible Form Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px]  opacity-100" : "max-h-0 opacity-0 w-0"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-lg shadow-lg p-5 space-y-5"
        >
          {/* ----------- Select Filters ----------- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <select
              className="bg-primary rounded p-2 text-white"
              id="Type"
              value={props.filter.Type}
              onChange={handleSelectChange}
            >
              <option value="">Select Property Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Independent House</option>
              <option>Plot</option>
              <option>Commercial</option>
              <option>Other</option>
            </select>

            <select
              className="bg-primary rounded p-2 text-white"
              id="BHK"
              value={props.filter.BHK}
              onChange={handleSelectChange}
            >
              <option value="">Select BHK</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4+ BHK</option>
            </select>

            <select
              className="bg-primary rounded p-2 text-white"
              id="Furnishing"
              value={props.filter.Furnishing}
              onChange={handleSelectChange}
            >
              <option value="">Select Furnishing</option>
              <option>Unfurnished</option>
              <option>Semi-furnished</option>
              <option>Fully-furnished</option>
            </select>

            <select
              className="bg-primary rounded p-2 text-white"
              id="Status"
              value={props.filter.Status}
              onChange={handleSelectChange}
            >
              <option value="">Select Status</option>
              <option>Ready to Move</option>
              <option>Under Construction</option>
              <option>New Launch</option>
            </select>
          </div>

          {/* ----------- Price Ranges ----------- */}
          <div className="space-y-2">
            <label className="font-semibold">Price Range (₹)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pl-5">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={
                      props.filter.Price.min === range.min &&
                      props.filter.Price.max === range.max
                    }
                    onChange={() => handlePriceCheckbox(range)}
                    className="accent-primary"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          {/* ----------- Area Ranges ----------- */}
          <div className="space-y-2">
            <label className="font-semibold">Area Range (sqft)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pl-5">
              {areaRanges.map((range, index) => (
                <label key={index} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={
                      props.filter.Area.min === range.min &&
                      props.filter.Area.max === range.max
                    }
                    onChange={() => handleAreaCheckbox(range)}
                    className="accent-primary"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          {/* ----------- Search Button ----------- */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
