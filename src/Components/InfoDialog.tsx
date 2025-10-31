import React from "react";
import { useState } from "react";

function InfoDialog(props: any) {
  console.log("inside info");
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative animate-fadeIn">
        {/* Close Button */}
        <form onSubmit={() => props.saveData()}>
          <button
            onClick={() => props.closeDialog()}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Property Info */}
          <div>
            <label
              htmlFor="desc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property Description
            </label>
            <textarea
              required
              id="desc"
              value={props.details.Description}
              onChange={(e) =>
                props.setDetails({
                  ...props.details,
                  Description: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter property description"
            />
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Details
            </label>
            <textarea
              required
              id="contact"
              value={props.details.Contact}
              onChange={(e) =>
                props.setDetails({ ...props.details, Contact: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter contact details"
            />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => props.closeDialog()}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InfoDialog;
