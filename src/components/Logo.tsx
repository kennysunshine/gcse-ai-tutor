"use client"

import React from 'react'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  showTagline?: boolean
}

export function Logo({ className = "h-12 w-auto", iconOnly = false, showTagline = true }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 280 120" 
      className={className}
      role="img"
      aria-label="LumenForge Logo"
    >
      <defs>
        <linearGradient id="capgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="boardgrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>

      {/* Mortarboard flat top — diamond */}
      <polygon points="56,20 82,31 56,42 30,31" fill="url(#boardgrad)"/>
      {/* Board highlight */}
      <polygon points="56,20 82,31 56,36 30,31" fill="#c084fc" opacity="0.25"/>
      {/* Centre button */}
      <circle cx="56" cy="20" r="3" fill="#e9d5ff"/>

      {/* Tassel cord — from left corner, falling left and down */}
      <path d="M 30,31 C 22,27 16,26 14,34 C 12,42 14,52 13,60" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Tassel knot */}
      <circle cx="13" cy="63" r="4" fill="#c084fc"/>
      {/* Tassel fringe */}
      <line x1="8"  y1="67" x2="6"  y2="82" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="68" x2="11" y2="83" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16" y1="68" x2="16" y2="83" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="20" y1="67" x2="21" y2="82" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Cap skull */}
      <path d="M 42,31 C 42,21 49,17 56,17 C 63,17 70,21 70,31 L 70,44 C 70,50 63,54 56,54 C 49,54 42,50 42,44 Z" fill="url(#capgrad)"/>
      {/* Cap highlight */}
      <path d="M 42,31 C 42,21 49,17 56,17 C 63,17 70,21 70,31 L 70,36 C 63,38 49,38 42,36 Z" fill="#d8b4fe" opacity="0.2"/>

      {!iconOnly && (
        <g>
          {/* Wordmark - Using text with multiple font fallbacks to match design intent */}
          <text 
            x="86" 
            y="42" 
            fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, system-ui, sans-serif" 
            fontSize="28" 
            fontWeight="800" 
            fill="currentColor" 
            letterSpacing="-0.3"
            className="text-foreground"
          >
            LumenForge
          </text>
          {showTagline && (
            <text 
              x="87" 
              y="56" 
              fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, system-ui, sans-serif" 
              fontSize="9" 
              fill="#a855f7" 
              fontWeight="600"
              letterSpacing="2.5"
              className="opacity-90"
            >
              AI SOCRATIC TUTOR
            </text>
          )}
        </g>
      )}
    </svg>
  )
}
