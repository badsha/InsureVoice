import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FileText, Search, BarChart3, Users, Clock, AlertTriangle } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  const getRoleSpecificContent = () => {
    switch (user.profile.role) {
      case 'policyholder':
        return {
          title: 'Welcome to Your Grievance Portal',
          subtitle: 'Submit and track your insurance-related complaints',
          actions: [
            {
              title: 'Submit New Grievance',
              description: 'File a complaint about your insurance experience',
              icon: FileText,
              link: '/submit',
              color: 'bg-blue-500 hover:bg-blue-600'
            },
            {
              title: 'Track Your Grievances',
              description: 'Monitor the progress of your submitted complaints',
              icon: Search,
              link: '/track',
              color: 'bg-green-500 hover:bg-green-600'
            }
          ]
        }
      
      case 'insurance_company':
        return {
          title: `Welcome, ${user.profile.company?.name || 'Insurance Company'} Representative`,
          subtitle: 'Manage and respond to customer grievances',
          actions: [
            {
              title: 'View Dashboard',
              description: 'See your company\'s grievance statistics and pending cases',
              icon: BarChart3,
              link: '/dashboard',
              color: 'bg-blue-500 hover:bg-blue-600'
            },
            {
              title: 'Manage Grievances',
              description: 'Review and respond to customer complaints',
              icon: Users,
              link: '/dashboard',
              color: 'bg-amber-500 hover:bg-amber-600'
            }
          ]
        }
      
      case 'idra_admin':
      case 'super_admin':
        return {
          title: 'IDRA Administrative Dashboard',
          subtitle: 'Monitor and regulate the insurance grievance ecosystem',
          actions: [
            {
              title: 'Analytics Dashboard',
              description: 'View system-wide statistics and trends',
              icon: BarChart3,
              link: '/dashboard',
              color: 'bg-purple-500 hover:bg-purple-600'
            },
            {
              title: 'Monitor Grievances',
              description: 'Oversee all grievances across insurance companies',
              icon: AlertTriangle,
              link: '/dashboard',
              color: 'bg-red-500 hover:bg-red-600'
            }
          ]
        }
      
      default:
        return {
          title: 'Welcome to IDRA GMS',
          subtitle: 'Access your personalized dashboard',
          actions: []
        }
    }
  }

  const content = getRoleSpecificContent()

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {content.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {content.subtitle}
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-gray-600 capitalize">
                {user.profile.role.replace('_', ' ')}
              </p>
              {user.profile.company && (
                <p className="text-sm text-gray-500 mt-1">
                  {user.profile.company.name}
                </p>
              )}
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Email: {user.email}</p>
              {user.phone && <p>Phone: {user.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {content.actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="group block"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-105 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats or Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Information
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Average Response Time</p>
            <p className="text-2xl font-bold text-blue-600">48 hours</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Customer Satisfaction</p>
            <p className="text-2xl font-bold text-green-600">95%</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Cases Resolved</p>
            <p className="text-2xl font-bold text-amber-600">10,000+</p>
          </div>
        </div>
      </div>
    </div>
  )
}