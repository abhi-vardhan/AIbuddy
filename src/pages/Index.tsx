
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import FileUpload from '@/components/FileUpload';
import StudyMaterialProcessor from '@/components/StudyMaterialProcessor';
import StudyScheduler from '@/components/StudyScheduler';
import StudyStats from '@/components/StudyStats';
import { Typography } from '@progress/kendo-react-common';
import { Pager, PageChangeEvent } from '@progress/kendo-react-data-tools';

const Index = () => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const totalPages = 3;

  const handlePageChange = (event: PageChangeEvent) => {
    // Calculate page from skip and take
    const newPage = Math.floor(event.skip / event.take) + 1;
    setCurrentPage(newPage);
  };

  // Function to handle file selection
  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files);
    setSelectedFiles(files);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section id="home" className="pt-10 pb-16 sm:pt-16 sm:pb-20">
        <Hero />
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <Typography.h2 className="text-3xl font-bold text-center mb-12">
            Powerful Study Features
          </Typography.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Typography.h3 className="text-xl font-bold mb-3">
                Flashcard Generation
              </Typography.h3>
              <Typography.p>
                Convert your notes into interactive flashcards automatically. Perfect for quick review sessions.
              </Typography.p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Typography.h3 className="text-xl font-bold mb-3">
                Quiz Builder
              </Typography.h3>
              <Typography.p>
                Generate practice quizzes from your study materials to test your knowledge.
              </Typography.p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Typography.h3 className="text-xl font-bold mb-3">
                Study Guides
              </Typography.h3>
              <Typography.p>
                Create comprehensive study guides summarizing key concepts from your materials.
              </Typography.p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Pager
              total={totalPages}
              skip={(currentPage - 1)}
              take={1}
              onPageChange={handlePageChange}
              buttonCount={5}
            />
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Typography.h2 className="text-3xl font-bold text-center mb-12">
            Try StudyBuddy Now
          </Typography.h2>
          <FileUpload onFilesSelected={handleFilesSelected} />
          <StudyMaterialProcessor files={selectedFiles} />
        </div>
      </section>
      
      {/* Study Scheduler Section */}
      <section id="scheduler" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <Typography.h2 className="text-3xl font-bold text-center mb-12">
            Plan Your Study Schedule
          </Typography.h2>
          <StudyScheduler />
        </div>
      </section>
      
      {/* Study Stats Section */}
      <section id="stats" className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Typography.h2 className="text-3xl font-bold text-center mb-12">
            Track Your Progress
          </Typography.h2>
          <StudyStats />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
