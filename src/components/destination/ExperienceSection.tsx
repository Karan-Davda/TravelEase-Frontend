
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Experience = {
  ExperienceID: number;
  ExperienceName: string;
  IsTicket: boolean;
  Amount: string;
  CityID: number;
  Description: string;
  PhotoURL: string;
  Status: string;
  Created: string;
  Modified: string;
  ModifiedBy: number;
};

type ExperienceSectionProps = {
  experiences: Experience[];
  cityName: string;
};

const ExperienceSection = ({ experiences, cityName }: ExperienceSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold">
            Experience top places in {cityName}
          </h2>
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View more <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <Card key={experience.ExperienceID} className="overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={experience.PhotoURL} 
                  alt={experience.ExperienceName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{experience.ExperienceName}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{experience.Description}</p>
                </div>
                
                <div className="mt-auto pt-4 flex justify-between items-center">
                  {experience.IsTicket && (
                    <div className="font-bold">
                      ${experience.Amount} <span className="text-xs font-normal text-gray-500">/person</span>
                    </div>
                  )}
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 font-medium flex items-center ml-auto"
                  >
                    View Details <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
