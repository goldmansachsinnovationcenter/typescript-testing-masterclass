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
        const basePath = process.env.NODE_ENV === 'production' 
          ? `/${process.env.CI_PROJECT_NAME || ''}`
          : '';
        
        const mainSections: Section[] = [
          { 
            title: 'Overview', 
            path: '/overview',
            subsections: []
          },
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
    return <div className="sidebar-loading">Loading...</div>;
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? '←' : '→'}
      </button>
      
      <div className="sidebar-content">
        <h3 className="sidebar-title">Navigation</h3>
        <ul className="sidebar-sections">
          <li className={router.pathname === '/' ? 'active' : ''}>
            <Link href="/">Home</Link>
          </li>
          
          {sections.map((section, index) => (
            <li key={index} className={router.pathname.startsWith(section.path) ? 'active' : ''}>
              <Link href={section.path}>{section.title}</Link>
              
              {section.subsections && section.subsections.length > 0 && (
                <ul className="subsections">
                  {section.subsections.map((subsection, subIndex) => (
                    <li key={subIndex}>
                      <Link href={subsection.path}>
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
      
      <style>{`
        .sidebar {
          position: fixed;
          top: 70px;
          left: 0;
          height: calc(100vh - 70px);
          background-color: #f8f9fa;
          transition: transform 0.3s ease;
          z-index: 100;
          display: flex;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar.open {
          transform: translateX(0);
        }
        
        .sidebar.closed {
          transform: translateX(calc(-100% + 30px));
        }
        
        .toggle-button {
          position: absolute;
          right: -30px;
          top: 20px;
          width: 30px;
          height: 40px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        
        .sidebar-content {
          width: 250px;
          padding: 1rem;
          overflow-y: auto;
        }
        
        .sidebar-title {
          margin-top: 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .sidebar-sections {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sidebar-sections li {
          margin-bottom: 0.5rem;
        }
        
        .sidebar-sections a {
          display: block;
          padding: 0.5rem 0;
          color: #333;
          text-decoration: none;
          font-weight: 500;
        }
        
        .sidebar-sections a:hover {
          color: #0070f3;
        }
        
        .active > a {
          color: #0070f3;
          font-weight: 600;
        }
        
        .subsections {
          list-style: none;
          padding-left: 1rem;
          margin: 0.5rem 0;
        }
        
        .subsection-link {
          display: block;
          padding: 0.25rem 0;
          color: #666;
          text-decoration: none;
          font-size: 0.9rem;
        }
        
        .subsection-link:hover {
          color: #0070f3;
        }
        
        .sidebar-loading {
          padding: 1rem;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .sidebar.open {
            transform: translateX(0);
          }
          
          .sidebar.closed {
            transform: translateX(-100%);
          }
          
          .toggle-button {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
