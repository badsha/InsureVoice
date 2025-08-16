import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, FileText, Search, Users, TrendingUp, CheckCircle, User } from 'lucide-react'

export default function LandingPage() {

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="idra-gradient text-white py-20 -mx-4 sm:-mx-6 lg:-mx-8 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            IDRA Grievance Management System
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Protecting policyholders' rights and ensuring fair insurance practices in Bangladesh
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Submit a Grievance
            </Link>
            <Link
              to="/track"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Track Your Case
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="mb-16">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Get Started
          </h2>
          <p className="text-blue-700 mb-6">
            Already have an account? Sign in to access your personalized dashboard
          </p>
          <Link
            to="/login"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <User className="w-5 h-5 mr-2" />
            Sign In to Your Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Submit Your Grievance</h3>
            <p className="text-gray-600">
              File your insurance-related complaint with detailed information about your issue.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Monitor the status of your grievance and receive updates throughout the process.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Resolution</h3>
            <p className="text-gray-600">
              Receive fair resolution of your grievance through our regulatory framework.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-16">
        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <p className="text-gray-600">Grievances Resolved</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">48hr</div>
              <p className="text-gray-600">Average Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* About IDRA Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              About IDRA
            </h2>
            <p className="text-gray-600 mb-4">
              The Insurance Development and Regulatory Authority (IDRA) is the apex regulatory body 
              for the insurance industry in Bangladesh, established to protect policyholders' interests 
              and ensure the sound development of the insurance sector.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Protecting policyholders' rights</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Regulating insurance companies</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700">Promoting industry development</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              If you have questions about filing a grievance or need assistance, 
              our support team is here to help.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Phone:</strong> +880-2-9560560</p>
              <p><strong>Email:</strong> info@idra.gov.bd</p>
              <p><strong>Office Hours:</strong> Sunday - Thursday, 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}