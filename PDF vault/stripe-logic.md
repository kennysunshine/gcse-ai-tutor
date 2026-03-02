Stripe Webhook Logic
Here is the data for my payment system:

import React, { useState } from 'react';

const FoundryScholarsForm = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      {!submitted ? (
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Foundry Scholars Program</h2>
            <p className="text-slate-600 mt-2">Apply for subsidized AI tutoring for disadvantaged pupils.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Applicant Type */}
            <label className="block">
              <span className="text-slate-700 font-medium">I am applying as a:</span>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option>Parent / Guardian</option>
                <option>Teacher / School Admin</option>
                <option>Local Authority Representative</option>
              </select>
            </label>

            {/* Eligibility Check - Critical for Social Value Score */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-700 font-medium block mb-2">Eligibility Status:</span>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600" />
                  <span className="ml-2 text-sm text-slate-600">Pupil is eligible for Free School Meals (FSM)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600" />
                  <span className="ml-2 text-sm text-slate-600">Pupil attracts Pupil Premium funding</span>
                </label>
              </div>
            </div>

            {/* Learning Focus */}
            <label className="block">
              <span className="text-slate-700 font-medium">Primary Learning Gap:</span>
              <textarea 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
                rows="3" 
                placeholder="e.g. Year 6 Fractions and Ratio (White Rose v3.0 focus)"
              ></textarea>
            </label>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition">
            Submit Scholarship Application
          </button>
          
          <p className="text-xs text-center text-slate-400">
            By submitting, you agree to the LumenForge Safeguarding and Data Privacy terms.
          </p>
        </form>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-green-600">Application Received</h3>
          <p className="mt-2 text-slate-600">We will review your eligibility against the DfE 2026 criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FoundryScholarsForm;