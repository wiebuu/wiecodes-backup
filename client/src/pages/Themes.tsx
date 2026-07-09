
import React, { useState } from 'react';
import { Star, Download, Eye, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const themes = [
  {
    id: 1,
    title: "Dark Modern Theme",
    category: "Web Theme",
    price: "₹1,499",
    rating: 4.9,
    downloads: "5.2k",
    preview: "/placeholder.svg",
    tags: ["Dark", "Modern", "Minimalist"],
    type: "web",
    framework: "CSS"
  },
  {
    id: 2,
    title: "Mobile App UI Kit",
    category: "Mobile Theme",
    price: "₹2,999",
    rating: 4.8,
    downloads: "2.1k",
    preview: "/placeholder.svg",
    tags: ["Mobile", "UI Kit", "Components"],
    type: "mobile",
    framework: "React Native"
  },
  {
    id: 3,
    title: "Corporate Dashboard",
    category: "Web Theme",
    price: "₹3,499",
    rating: 4.7,
    downloads: "1.8k",
    preview: "/placeholder.svg",
    tags: ["Corporate", "Dashboard", "Professional"],
    type: "web",
    framework: "React"
  },
  {
    id: 4,
    title: "E-commerce Mobile",
    category: "Mobile Theme",
    price: "₹4,199",
    rating: 4.9,
    downloads: "1.5k",
    preview: "/placeholder.svg",
    tags: ["E-commerce", "Shopping", "Mobile"],
    type: "mobile",
    framework: "Flutter"
  },
  {
    id: 5,
    title: "Creative Portfolio",
    category: "Web Theme",
    price: "₹2,299",
    rating: 4.6,
    downloads: "2.8k",
    preview: "/placeholder.svg",
    tags: ["Creative", "Portfolio", "Artistic"],
    type: "web",
    framework: "Vue"
  },
  {
    id: 6,
    title: "Social Media App",
    category: "Mobile Theme",
    price: "₹3,799",
    rating: 4.8,
    downloads: "1.9k",
    preview: "/placeholder.svg",
    tags: ["Social", "Media", "Chat"],
    type: "mobile",
    framework: "React Native"
  }
];

const Themes = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-primary mb-4 tracking-tight">
                Premium Themes
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Beautiful, responsive themes for web and mobile applications
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="bg-secondary/30 p-6 rounded-lg mb-12">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Platform Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="web">Web Apps</SelectItem>
                      <SelectItem value="mobile">Mobile Apps</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Frameworks</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="flutter">Flutter</SelectItem>
                      <SelectItem value="react-native">React Native</SelectItem>
                      <SelectItem value="css">CSS/HTML</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-2000">₹0 - ₹2,000</SelectItem>
                      <SelectItem value="2000-4000">₹2,000 - ₹4,000</SelectItem>
                      <SelectItem value="4000+">₹4,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Toggle 
                    pressed={viewMode === 'grid'} 
                    onPressedChange={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </Toggle>
                  <Toggle 
                    pressed={viewMode === 'list'} 
                    onPressedChange={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </Toggle>
                </div>
              </div>
            </div>

            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {themes.map((theme) => (
                <Card key={theme.id} className={`elegant-card group cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
                  <CardContent className="p-0">
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''} rounded-${viewMode === 'list' ? 'l' : 't'}-lg`}>
                      <img 
                        src={theme.preview} 
                        alt={theme.title}
                        className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === 'list' ? 'w-64 h-full' : 'w-full h-48'}`}
                      />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Button 
                        size="sm" 
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 classy-button"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                    
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-medium">{theme.category}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{theme.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-heading font-semibold text-primary mb-3">{theme.title}</h3>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {theme.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Download className="w-4 h-4" />
                          <span className="text-sm">{theme.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xl font-heading font-bold text-primary">{theme.price}</span>
                          <Button size="sm" className="classy-button">
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Themes;
