'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight, Shield, Users, Zap, Sparkles, Globe } from 'lucide-react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedButton } from '@/components/ui/AnimatedButton'

export default function HomePage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -30])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">CardanoID</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          </div>
          
          <AnimatedButton href="/app" variant="primary">
            Launch App
            <ChevronRight className="w-4 h-4 ml-1" />
          </AnimatedButton>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: y1 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Cardano Blockchain
            </div>
            
            <h1 className="text-display-2xl font-bold text-gray-900 mb-6 leading-tight">
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
              <AnimatedButton href="/app" variant="primary" size="lg">
                Create Your Identity
                <ChevronRight className="w-5 h-5 ml-2" />
              </AnimatedButton>
              
              <AnimatedButton href="#demo" variant="secondary" size="lg">
                Watch Demo
              </AnimatedButton>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ y: y2 }}
            className="mt-20 relative"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Main Card */}
              <GlassCard className="p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
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
              </GlassCard>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20"
              />
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl opacity-20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-display-lg font-bold text-gray-900 mb-6">
              Decentralized by Design
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of digital identity with blockchain technology 
              that puts you in complete control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8 h-full hover:shadow-card-hover transition-shadow duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 bg-gradient-to-br from-blue-50 to-purple-50">
              <h2 className="text-display-lg font-bold text-gray-900 mb-6">
                Ready to Own Your Identity?
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join the decentralized identity revolution. Create your profile, 
                connect with others, and build your reputation on the blockchain.
              </p>
              
              <AnimatedButton href="/app" variant="primary" size="lg">
                Get Started Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </AnimatedButton>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Shield,
    title: 'Truly Decentralized',
    description: 'Your data lives on the Cardano blockchain, not on centralized servers. You own it, you control it, forever.'
  },
  {
    icon: Users,
    title: 'Authentic Connections',
    description: 'Connect with people based on genuine interests and verified skills. No algorithms, no fake profiles.'
  },
  {
    icon: Globe,
    title: 'Cross-Platform Identity',
    description: 'Use your identity across any Web3 application. One identity, unlimited possibilities.'
  }
]