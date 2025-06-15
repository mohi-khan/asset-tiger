"use client"

import HomeNavbar from "../shared/home-navbar"

export default function Home() {
  return (
    <>
    <HomeNavbar />

      {/* Home Section */}
      <section id="home" className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Asset Tiger</h1>
          <p className="text-xl mb-8">Asset management made simple and efficient</p>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="min-h-screen bg-white pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Reviews</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">Asset Tiger has transformed how we manage our inventory. Highly recommended!</p>
              <p className="font-medium">- John D., IT Manager</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">The best asset management solution we've used. Simple yet powerful.</p>
              <p className="font-medium">- Sarah M., Operations Director</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">Asset Tracking</h3>
              <p>Track all your assets in real-time with our powerful system</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">Maintenance Scheduling</h3>
              <p>Schedule and track maintenance for all your assets</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">Reporting</h3>
              <p>Generate detailed reports on asset usage and status</p>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section id="apps" className="min-h-screen bg-white pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Apps</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="text-center">
              <div className="bg-gray-100 rounded-xl p-8 mb-4">
                <span className="text-5xl">📱</span>
              </div>
              <h3 className="text-xl font-bold">Mobile App</h3>
              <p>Available on iOS and Android</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-xl p-8 mb-4">
                <span className="text-5xl">💻</span>
              </div>
              <h3 className="text-xl font-bold">Web App</h3>
              <p>Access from any browser</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-xl p-8 mb-4">
                <span className="text-5xl">🖥️</span>
              </div>
              <h3 className="text-xl font-bold">Desktop App</h3>
              <p>For Windows and Mac</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-yellow-500 text-2xl font-bold">01</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Save Time</h3>
                <p>Automate asset tracking and reduce manual work</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-yellow-500 text-2xl font-bold">02</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Reduce Costs</h3>
                <p>Optimize asset utilization and prevent losses</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-yellow-500 text-2xl font-bold">03</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Improve Accuracy</h3>
                <p>Eliminate human errors in asset management</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-yellow-500 text-2xl font-bold">04</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Enhance Compliance</h3>
                <p>Meet regulatory requirements with ease</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen bg-white pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-3xl font-bold mb-4">
                $29<span className="text-base font-normal">/month</span>
              </p>
              <ul className="mb-6 space-y-2">
                <li>Up to 100 assets</li>
                <li>Basic reporting</li>
                <li>Email support</li>
              </ul>
              <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Get Started</button>
            </div>
            <div className="border rounded-lg p-6 bg-gray-50 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-3xl font-bold mb-4">
                $79<span className="text-base font-normal">/month</span>
              </p>
              <ul className="mb-6 space-y-2">
                <li>Up to 1,000 assets</li>
                <li>Advanced reporting</li>
                <li>Priority support</li>
                <li>API access</li>
              </ul>
              <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Get Started</button>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-3xl font-bold mb-4">
                $199<span className="text-base font-normal">/month</span>
              </p>
              <ul className="mb-6 space-y-2">
                <li>Unlimited assets</li>
                <li>Custom reporting</li>
                <li>24/7 support</li>
                <li>Dedicated account manager</li>
              </ul>
              <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">How does Asset Tiger work?</h3>
              <p>
                Asset Tiger provides a comprehensive platform for tracking, managing, and optimizing your assets
                throughout their lifecycle.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Can I import my existing asset data?</h3>
              <p>
                Yes, Asset Tiger supports importing data from CSV files, Excel spreadsheets, and other asset management
                systems.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Is there a free trial available?</h3>
              <p>
                Yes, we offer a 14-day free trial with full access to all features so you can evaluate if Asset Tiger is
                right for your organization.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">How secure is my data?</h3>
              <p>
                Asset Tiger uses enterprise-grade encryption and security measures to ensure your data is always
                protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen bg-white pt-24 px-4">
        <div className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <form className="space-y-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <input type="text" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input type="email" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1">Message</label>
                  <textarea className="w-full p-2 border rounded h-32"></textarea>
                </div>
                <button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600">Send Message</button>
              </form>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
              <p className="mb-6">
                Have questions about Asset Tiger? Our team is here to help you find the right solution for your asset
                management needs.
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> support@assettiger.com
                </p>
                <p>
                  <strong>Phone:</strong> (555) 123-4567
                </p>
                <p>
                  <strong>Address:</strong> 123 Asset Street, Tiger City, AT 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
