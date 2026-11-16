import React from 'react';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Skills } from '../components/sections/Skills';
import { FeaturedProjects } from '../components/sections/FeaturedProjects';
import { Experience } from '../components/sections/Experience';
import { Certifications } from '../components/sections/Certifications';
import { Contact } from '../components/sections/Contact';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <Experience />
      <Certifications />
      <Contact />
    </div>
  );
};
