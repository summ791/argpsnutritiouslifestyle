import React from 'react';

export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{
    className?: string;
    size?: number | string;
    strokeWidth?: number | string;
  }>;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
}

export interface NavLink {
  name: string;
  path: string;
}
