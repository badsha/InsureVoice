import React, { useState } from 'react'
import { Search, Calendar, User, Building, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function TrackGrievancePage() {
  const [grievanceId, setGrievanceId] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock data based on grievance ID
      if (grievanceId === 'GRV-2025-00001') {
        setSearchResult({
          id: 1,
          grievance_id: 'GRV-2025-00001',
          title: 'Claim Settlement Delay for Motor Insurance',
          description: 'My motor insurance claim has been pending for over 45 days without any response from the company.',
          category: 'claim_settlement',
          status: 'under_review',
          priority: 'high',
          complainant_name: 'Alice Rahman',
          complainant_email: 'alice@example.com',
          complainant_phone: '+880-1711-123456',
          policy_number: 'MOT-2024-001234',
          claim_amount: 150000.00,
          submitted_at: '2025-08-08T10:30:00Z',
          sla_deadline: '2025-08-15T10:30:00Z',
          insurance_company: {
            name: 'Dhaka Insurance Limited',
            license_number: 'DIN-001'
          },
          messages: [
            {
              id: 1,
              content: 'Your grievance has been received and is under review.',
              sender: { first_name: 'System', last_name: 'Admin' },
              created_at: '2025-08-08T10:35:00Z',
              is_internal: false
            },
            {
              id: 2,
              content: 'We have forwarded your complaint to the insurance company for response.',
              sender: { first_name: 'IDRA', last_name: 'Officer' },
              created_at: '2025-08-09T14:20:00Z',
              is_internal: false
            }
          ]
        })
      } else {
        setError('Grievance not found. Please check the ID and try again.')
      }
    } catch (err) {
      setError('Failed to search for grievance. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100'
      case 'under_review': return 'text-amber-600 bg-amber-100'
      case 'pending_response': return 'text-blue-600 bg-blue-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-orange-600'
      case 'urgent': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Grievance
          </h1>
          <p className="text-gray-600">
            Enter your grievance ID to check the current status and progress.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grievance ID
              </label>
              <input
                type="text"
                value={grievanceId}
                onChange={(e) => setGrievanceId(e.target.value)}
                placeholder="e.g., GRV-2025-00001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="sm:pt-7">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Track
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo Information */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Demo:</strong> Try searching for "GRV-2025-00001" to see a sample grievance tracking result.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResult && (
          <div className="space-y-6">
            {/* Grievance Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchResult.title}
                  </h2>
                  <p className="text-gray-600">ID: {searchResult.grievance_id}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                    {searchResult.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className={`text-sm font-medium mt-1 ${getPriorityColor(searchResult.priority)}`}>
                    {searchResult.priority.toUpperCase()} PRIORITY
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Complainant: {searchResult.complainant_name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <span>Company: {searchResult.insurance_company.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Submitted: {formatDate(searchResult.submitted_at)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Policy Number:</span>
                    <span className="ml-2">{searchResult.policy_number}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Category:</span>
                    <span className="ml-2 capitalize">{searchResult.category.replace('_', ' ')}</span>
                  </div>
                  {searchResult.claim_amount && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Claim Amount:</span>
                      <span className="ml-2">৳{searchResult.claim_amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700">{searchResult.description}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h3>
              <div className="space-y-4">
                {searchResult.messages.map((message: any, index: number) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {index === 0 ? (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {message.sender.first_name} {message.sender.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Information */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-amber-600 mr-3" />
                <div>
                  <p className="text-amber-800 font-medium">Service Level Agreement</p>
                  <p className="text-amber-700 text-sm">
                    Response deadline: {formatDate(searchResult.sla_deadline)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}