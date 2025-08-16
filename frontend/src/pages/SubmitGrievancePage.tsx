import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { FileText, Send, AlertCircle } from 'lucide-react'

export default function SubmitGrievancePage() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    complainant_name: user ? `${user.first_name} ${user.last_name}` : '',
    complainant_email: user?.email || '',
    complainant_phone: user?.phone || '',
    policy_number: '',
    insurance_company_id: '',
    claim_amount: '',
  })

  const categories = [
    { value: 'claim_settlement', label: 'Claim Settlement' },
    { value: 'policy_terms', label: 'Policy Terms & Conditions' },
    { value: 'premium_issues', label: 'Premium Issues' },
    { value: 'service_quality', label: 'Service Quality' },
    { value: 'agent_conduct', label: 'Agent Conduct' },
    { value: 'documentation', label: 'Documentation Issues' },
    { value: 'fraud_concern', label: 'Fraud Concern' },
    { value: 'other', label: 'Other' },
  ]

  const companies = [
    { id: 1, name: 'Dhaka Insurance Limited' },
    { id: 2, name: 'Bangladesh General Insurance' },
    { id: 3, name: 'United Insurance Company' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitted(true)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (submitted) {
    return (
      <div className="fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Grievance Submitted Successfully!
            </h2>
            <p className="text-green-700 mb-4">
              Your grievance has been recorded and assigned ID: <strong>GRV-2025-00004</strong>
            </p>
            <p className="text-green-600 text-sm mb-6">
              You will receive updates via email and can track the progress using the grievance ID.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    title: '',
                    description: '',
                    category: '',
                    complainant_name: user ? `${user.first_name} ${user.last_name}` : '',
                    complainant_email: user?.email || '',
                    complainant_phone: user?.phone || '',
                    policy_number: '',
                    insurance_company_id: '',
                    claim_amount: '',
                  })
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Another Grievance
              </button>
              <div>
                <a
                  href="/track"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Track Your Grievance →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit a Grievance
          </h1>
          <p className="text-gray-600">
            File your insurance-related complaint. All fields marked with * are required.
          </p>
        </div>

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3" />
              <p className="text-blue-800">
                You can submit a grievance as a guest, or log in for easier tracking and management.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="complainant_name"
                    value={formData.complainant_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="complainant_email"
                    value={formData.complainant_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="complainant_phone"
                    value={formData.complainant_phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    name="policy_number"
                    value={formData.policy_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Grievance Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grievance Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Company *
                  </label>
                  <select
                    name="insurance_company_id"
                    value={formData.insurance_company_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Insurance Company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief summary of your grievance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Please provide detailed information about your grievance, including dates, policy details, and any relevant circumstances."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Amount (if applicable)
                  </label>
                  <input
                    type="number"
                    name="claim_amount"
                    value={formData.claim_amount}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="Enter amount in BDT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Grievance
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}