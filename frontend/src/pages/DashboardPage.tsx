import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { BarChart3, TrendingUp, Users, AlertCircle, Clock, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  const getRoleDashboard = () => {
    switch (user.profile.role) {
      case 'policyholder':
        return <PolicyholderDashboard />
      
      case 'insurance_company':
        return <InsuranceCompanyDashboard user={user} />
      
      case 'idra_admin':
      case 'super_admin':
        return <IDRADashboard />
      
      default:
        return <DefaultDashboard />
    }
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          {user.profile.role === 'policyholder' && 'Track your grievances and their progress'}
          {user.profile.role === 'insurance_company' && 'Manage customer grievances and company performance'}
          {(user.profile.role === 'idra_admin' || user.profile.role === 'super_admin') && 'Monitor the insurance grievance ecosystem'}
        </p>
      </div>

      {getRoleDashboard()}
    </div>
  )
}

function PolicyholderDashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Grievances</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Resolution</p>
              <p className="text-2xl font-bold text-gray-900">5d</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Grievances */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Recent Grievances</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Claim Settlement Delay</h3>
                <p className="text-sm text-gray-600">GRV-2025-00001 • Submitted 3 days ago</p>
              </div>
              <span className="status-badge status-under_review">Under Review</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Premium Calculation Issue</h3>
                <p className="text-sm text-gray-600">GRV-2025-00002 • Submitted 1 week ago</p>
              </div>
              <span className="status-badge status-resolved">Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InsuranceCompanyDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {user.profile.company?.name || 'Company'} Overview
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">15</div>
            <p className="text-sm text-gray-600">Total Grievances</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">3</div>
            <p className="text-sm text-gray-600">Pending Response</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">12</div>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">4.2d</div>
            <p className="text-sm text-gray-600">Avg. Response Time</p>
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pending Actions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Motor Insurance Claim Delay</h3>
                <p className="text-sm text-gray-600">GRV-2025-00001 • Due in 2 days</p>
              </div>
              <span className="text-sm font-medium text-red-600">High Priority</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Health Insurance Query</h3>
                <p className="text-sm text-gray-600">GRV-2025-00003 • Due in 5 days</p>
              </div>
              <span className="text-sm font-medium text-amber-600">Medium Priority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function IDRADashboard() {
  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Grievances</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">SLA Breaches</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Companies</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Performance */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Company Performance Monitoring</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Dhaka Insurance Limited</p>
                <p className="text-sm text-gray-600">15 grievances</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">3.2d</p>
                <p className="text-xs text-gray-600">Avg Response</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">96%</p>
                <p className="text-xs text-gray-600">Resolution Rate</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bangladesh General Insurance</p>
                <p className="text-sm text-gray-600">8 grievances</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">6.1d</p>
                <p className="text-xs text-gray-600">Avg Response</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">87%</p>
                <p className="text-xs text-gray-600">Resolution Rate</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-amber-600">Needs Attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DefaultDashboard() {
  return (
    <div className="text-center py-12">
      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Not Available</h3>
      <p className="text-gray-600">Dashboard content is not configured for your role.</p>
    </div>
  )
}