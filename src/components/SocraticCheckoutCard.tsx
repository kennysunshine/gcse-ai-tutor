"use client"

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface SocraticCheckoutCardProps {
  subjectName: string;
}

export function SocraticCheckoutCard({ subjectName }: SocraticCheckoutCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/whop/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'Mastery',
          priceAmount: 24.99,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = '/login?redirect=/sandbox';
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full text-left"
    >
      <div className="bg-primary p-10 rounded-[2.5rem] shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 group relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <h4 className="text-primary-foreground text-2xl font-black mb-4">
          {isLoading ? "Preparing Audit..." : "Start Your Mastery Audit"}
        </h4>
        <p className="text-primary-foreground/80 text-sm font-medium mb-8">
          Identify the cognitive gaps in your {subjectName} foundation today.
        </p>
        <div className="flex items-center text-primary-foreground font-black text-xs uppercase tracking-widest">
          {isLoading ? "Connecting to Whop..." : "Begin the Socratic Path"} 
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </button>
  );
}
