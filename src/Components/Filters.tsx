import React, { useCallback, useState } from "react";
import { Filter } from "lucide-react"; // icon (from lucide-react, lightweight)

export default function Filters(props: any) {
  const [isOpen, setIsOpen] = useState(false);

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

  const priceRanges = [
    { label: "Below ₹25 Lakh", min: 0, max: 2500000 },
    { label: "₹25 L – ₹50 L", min: 2500000, max: 5000000 },
    { label: "₹50 L – ₹1 Cr", min: 5000000, max: 10000000 },
    { label: "₹1 Cr – ₹5 Cr", min: 10000000, max: 50000000 },
    { label: "Above ₹5 Cr", min: 50000000, max: Infinity },
  ];

  const areaRanges = [
    { label: "Below 500 sqft", min: 0, max: 500 },
    { label: "500 – 1000 sqft", min: 500, max: 1000 },
    { label: "1000 – 1500 sqft", min: 1000, max: 1500 },
    { label: "1500 – 2500 sqft", min: 1500, max: 2500 },
    { label: "2500 – 5000 sqft", min: 2500, max: 5000 },
    { label: "Above 5000 sqft", min: 5000, max: Infinity },
  ];

  return (
    <div className="relative">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all z-50"
        >
          <Filter className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end sm:items-center z-50">
          <div className="bg-white w-full sm:w-[600px] max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-y-auto p-5 space-y-6 animate-slide-up relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-primary text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold text-primary text-center">
              Filters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "Type",
                  label: "Property Type",
                  options: [
                    "Apartment",
                    "Villa",
                    "Independent House",
                    "Plot",
                    "Commercial",
                    "Other",
                  ],
                },
                {
                  id: "BHK",
                  label: "BHK",
                  options: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
                },
                {
                  id: "Furnishing",
                  label: "Furnishing",
                  options: ["Unfurnished", "Semi-furnished", "Fully-furnished"],
                },
                {
                  id: "Status",
                  label: "Status",
                  options: [
                    "Ready to Move",
                    "Under Construction",
                    "New Launch",
                  ],
                },
              ].map((select) => (
                <div key={select.id} className="flex flex-col">
                  <select
                    className="bg-primary rounded-md p-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    id={select.id}
                    value={props.filter[select.id]}
                    onChange={handleSelectChange}
                  >
                    <option value="">{`Select ${select.label}`}</option>
                    {select.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-800">
                Price Range (₹)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1 sm:pl-5">
                {priceRanges.map((range, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={
                        props.filter.Price.min === range.min &&
                        props.filter.Price.max === range.max
                      }
                      onChange={() => handlePriceCheckbox(range)}
                      className="accent-primary w-4 h-4"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-800">
                Area Range (sqft)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1 sm:pl-5">
                {areaRanges.map((range, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={
                        props.filter.Area.min === range.min &&
                        props.filter.Area.max === range.max
                      }
                      onChange={() => handleAreaCheckbox(range)}
                      className="accent-primary w-4 h-4"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition w-full sm:w-auto"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
