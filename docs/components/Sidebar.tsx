import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Section = {
  title: string;
  path: string;
  subsections?: Subsection[];
};

type Subsection = {
  title: string;
  path: string;
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSections() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        
        const mainSections: Section[] = [
          { 
            title: 'Unit Tests', 
            path: '/unit-tests',
            subsections: []
          },
          { 
            title: 'Integration Tests', 
            path: '/integration-tests',
            subsections: []
          },
          { 
            title: 'E2E Tests', 
            path: '/e2e-tests',
            subsections: []
          },
          { 
            title: 'Common Patterns', 
            path: '/common-patterns',
            subsections: []
          }
        ];

        for (const section of mainSections) {
          try {
            const response = await fetch(`${basePath}/content${section.path}.json`);
            if (response.ok) {
              const data = await response.json();
              
              const subsectionMap = new Map<string, Subsection>();
              
              if (Array.isArray(data)) {
                data.forEach((example: any) => {
                  if (example.dirName && !subsectionMap.has(example.dirName)) {
                    subsectionMap.set(example.dirName, {
                      title: formatTitle(example.dirName),
                      path: `${section.path}#${example.dirName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                    });
                  }
                });
                
                section.subsections = Array.from(subsectionMap.values());
              }
            }
          } catch (err) {
            console.error(`Error loading subsections for ${section.title}:`, err);
          }
        }
        
        setSections(mainSections);
        setLoading(false);
      } catch (err) {
        console.error('Error loading sidebar sections:', err);
        setLoading(false);
      }
    }

    loadSections();
  }, []);

  const formatTitle = (dirName: string): string => {
    return dirName
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-16 text-gray-500">Loading...</div>;
  }

  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-64'}`}>
      <button 
        className="absolute right-0 top-4 translate-x-full bg-primary text-white p-2 rounded-r-md shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? '←' : '→'}
      </button>
      
      <div className="w-64 h-full overflow-y-auto p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Navigation</h3>
        <ul className="space-y-1">
          <li>
            {/* @ts-ignore - Type compatibility issue with Link component */}
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md ${router.pathname === '/' ? 'bg-primary-50 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Home
            </Link>
          </li>
          
          {sections.map((section, index) => (
            <li key={index} className="mt-2">
              {/* @ts-ignore - Type compatibility issue with Link component */}
              <Link 
                href={section.path} 
                className={`block px-3 py-2 rounded-md ${router.pathname.startsWith(section.path) ? 'bg-primary-50 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {section.title}
              </Link>
              
              {section.subsections && section.subsections.length > 0 && (
                <ul className="pl-4 mt-1 space-y-1">
                  {section.subsections.map((subsection, subIndex) => (
                    <li key={subIndex}>
                      {/* @ts-ignore - Type compatibility issue with Link component */}
                      <Link 
                        href={subsection.path} 
                        className="block px-3 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100"
                      >
                        {subsection.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
