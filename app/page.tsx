'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 动态背景效果 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-4000" />
      </div>

      {/* 网格背景 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-slate-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CardanoID
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/app"
                className="group relative px-8 py-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center space-x-2 font-semibold text-white">
                  <span>Launch App</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-300 text-sm font-medium animate-fade-in">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
              Powered by Cardano Blockchain
            </div>

            {/* Main Heading */}
            <h1 className="text-7xl md:text-8xl font-black leading-tight animate-slide-up">
              <span className="block text-white mb-4">Your Digital</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Identity
              </span>
              <span className="block text-2xl md:text-3xl text-gray-400 mt-6 font-normal">
                Truly Yours. Forever.
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Build your decentralized identity on Cardano. Connect with like-minded people,
              showcase your skills, and own your digital presence forever.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-scale-in">
              <Link
                href="/app"
                className="group relative px-10 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative flex items-center space-x-2 text-lg font-bold text-white">
                  <span>Create Your Identity</span>
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </Link>

              <button className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white text-lg font-semibold hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>

            {/* Hero Visual */}
            <div className="relative mt-20 animate-fade-in">
              <div className="relative max-w-5xl mx-auto perspective-1000">
                {/* Main Card */}
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card Content */}
                  <div className="relative p-10 bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75 animate-pulse" />
                        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
                          <span className="text-6xl">⚡</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <h3 className="text-3xl font-bold text-white mb-2">Khalil</h3>
                        <p className="text-gray-400 text-lg mb-6">Cardano DApp Developer</p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">156</div>
                            <div className="text-sm text-gray-500 mt-1">Connections</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">95</div>
                            <div className="text-sm text-gray-500 mt-1">Reputation</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">12</div>
                            <div className="text-sm text-gray-500 mt-1">Skills</div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {['Cardano', 'React', 'TypeScript', 'Plutus', 'Music'].map((skill, i) => (
                            <span
                              key={skill}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 text-blue-300 rounded-xl text-sm font-medium hover:from-blue-500/20 hover:to-purple-500/20 hover:scale-110 transition-all duration-300 cursor-pointer"
                              style={{ animationDelay: `${i * 100}ms` }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl opacity-20 blur-xl animate-float" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl opacity-20 blur-xl animate-float animation-delay-2000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Decentralized by Design
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of digital identity with blockchain technology
              that puts you in complete control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🛡️',
                title: 'Truly Decentralized',
                desc: 'Your data lives on the Cardano blockchain, not on centralized servers. You own it, you control it, forever.',
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                icon: '👥',
                title: 'Authentic Connections',
                desc: 'Connect with people based on genuine interests and verified skills. No algorithms, no fake profiles.',
                gradient: 'from-green-500 to-teal-600'
              },
              {
                icon: '🌍',
                title: 'Cross-Platform Identity',
                desc: 'Use your identity across any Web3 application. One identity, unlimited possibilities.',
                gradient: 'from-purple-500 to-pink-600'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {/* Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500`} />
                
                {/* Card */}
                <div className="relative p-8 bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 transform group-hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative group">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative p-16 bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/20">
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Own Your Identity?
              </h2>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the decentralized identity revolution. Create your profile,
                connect with others, and build your reputation on the blockchain.
              </p>

              <Link
                href="/app"
                className="group inline-block relative px-12 py-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative flex items-center space-x-2 text-xl font-bold text-white">
                  <span>Get Started Now</span>
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Built with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span className="text-gray-400">on</span>
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cardano
              </span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
