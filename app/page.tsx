'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CardanoID</span>
          </div>

          <Link
            href="/app"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8">
            ⚡ Powered by Cardano Blockchain
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Digital Identity.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Truly Yours.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Build your decentralized identity on Cardano. Connect with like-minded people,
            showcase your skills, and own your digital presence forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/app"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Create Your Identity →
            </Link>

            <button className="px-8 py-4 bg-white/80 border border-gray-200 text-gray-900 rounded-xl font-medium hover:bg-white hover:border-gray-300 transition-all text-lg">
              Watch Demo
            </button>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="relative max-w-4xl mx-auto">
              {/* Main Card */}
              <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Khalil</h3>
                    <p className="text-gray-600">Cardano DApp Developer</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-500">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">95</div>
                    <div className="text-sm text-gray-500">Reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-500">Skills</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Cardano', 'React', 'TypeScript', 'Plutus', 'Music'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Decentralized by Design
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of digital identity with blockchain technology
              that puts you in complete control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🛡️</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Truly Decentralized
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Your data lives on the Cardano blockchain, not on centralized servers. You own it, you control it, forever.
              </p>
            </div>

            <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">👥</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Authentic Connections
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Connect with people based on genuine interests and verified skills. No algorithms, no fake profiles.
              </p>
            </div>

            <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🌍</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cross-Platform Identity
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Use your identity across any Web3 application. One identity, unlimited possibilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border border-white/50 shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Own Your Identity?
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the decentralized identity revolution. Create your profile,
              connect with others, and build your reputation on the blockchain.
            </p>

            <Link
              href="/app"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>Built with ❤️ on Cardano blockchain</p>
        </div>
      </footer>
    </div>
  )
}
