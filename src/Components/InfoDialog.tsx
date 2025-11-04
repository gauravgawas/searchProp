function InfoDialog(props: any) {
  const details = props.details;

  const handleChange = (field: string, value: any) => {
    props.setDetails({ ...details, [field]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.saveData();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[32rem] p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => props.closeDialog()}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Property Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property Title
            </label>
            <input
              disabled={props.readonly}
              id="title"
              type="text"
              required
              value={details.Title || ""}
              onChange={(e) => handleChange("Title", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g., 2BHK Apartment in Baner"
            />
          </div>

          {/* Property Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property Type
            </label>
            <select
              disabled={props.readonly}
              id="type"
              value={details.Type || ""}
              onChange={(e) => handleChange("Type", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Independent House</option>
              <option>Plot</option>
              <option>Commercial</option>
              <option>Other</option>
            </select>
          </div>

          {/* BHK */}
          <div>
            <label
              htmlFor="bhk"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              BHK
            </label>
            <select
              disabled={props.readonly}
              id="bhk"
              value={details.BHK || ""}
              onChange={(e) => handleChange("BHK", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select BHK</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4+ BHK</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (in ₹)
            </label>
            <input
              disabled={props.readonly}
              id="price"
              type="number"
              required
              value={details.Price || ""}
              onChange={(e) => handleChange("Price", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g., 5000000"
            />
          </div>

          {/* Area */}
          <div>
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area (sqft)
            </label>
            <input
              disabled={props.readonly}
              id="area"
              type="number"
              required
              value={details.Area || ""}
              onChange={(e) => handleChange("Area", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="e.g., 1200"
            />
          </div>

          {/* Furnishing */}
          <div>
            <label
              htmlFor="furnishing"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Furnishing
            </label>
            <select
              disabled={props.readonly}
              id="furnishing"
              value={details.Furnishing || ""}
              onChange={(e) => handleChange("Furnishing", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option>Unfurnished</option>
              <option>Semi-furnished</option>
              <option>Fully-furnished</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              disabled={props.readonly}
              id="status"
              value={details.Status || ""}
              onChange={(e) => handleChange("Status", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option>Ready to Move</option>
              <option>Under Construction</option>
              <option>New Launch</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="desc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property Description
            </label>
            <textarea
              disabled={props.readonly}
              id="desc"
              required
              value={details.Description || ""}
              onChange={(e) => handleChange("Description", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
              placeholder="Enter property description"
            />
          </div>

          {/* Contact Details */}
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Details
            </label>
            <textarea
              disabled={props.readonly}
              id="contact"
              required
              value={details.Contact || ""}
              onChange={(e) => handleChange("Contact", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-16"
              placeholder="Enter contact details"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => props.closeDialog()}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
            {!props.readonly && (
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default InfoDialog;
