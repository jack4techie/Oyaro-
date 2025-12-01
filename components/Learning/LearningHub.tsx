
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, PlayCircle, Award, BookOpen, Layers } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Course } from '../../types';

const LearningHub: React.FC = () => {
  const { courses, userProgress } = useAppContext();
  const navigate = useNavigate();

  const getProgress = (courseId: string) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    if (!progress) return 0;
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    return Math.round((progress.completedLessonIds.length / course.lessons.length) * 100);
  };

  // Group courses by level for distinction
  const groupedCourses = {
    'Senior Secondary': courses.filter(c => c.level === 'Senior Secondary'),
    'Tertiary & Skills': courses.filter(c => c.level === 'Tertiary & Skills'),
    'Junior Secondary': courses.filter(c => c.level === 'Junior Secondary'),
  };

  const renderCourseCard = (course: Course) => {
    const progress = getProgress(course.id);
    return (
      <div 
        key={course.id} 
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all flex flex-col group cursor-pointer"
        onClick={() => navigate(`/learning/course/${course.id}`)}
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded capitalize">
            {course.category}
          </div>
          {progress === 100 && (
            <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full shadow-lg">
              <Award className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight">{course.title}</h3>
          </div>
          
          <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{course.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons.length} Lessons</span>
              <span>{progress}% Complete</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>

            <button className="w-full bg-slate-50 text-primary border border-slate-200 py-2 rounded-lg text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center gap-2">
              {progress > 0 ? 'Continue Learning' : 'Start Course'} <PlayCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-serif font-bold">Maonda Learning Center</h2>
          </div>
          <p className="text-blue-100 max-w-xl">
            A comprehensive CBC-based curriculum hub tailored for the Kenyan syllabus. 
            Access Senior School resources, IT skills, and Junior Secondary fundamentals integrated with AI tutoring.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
           <Layers className="w-64 h-64 -mb-10 -mr-10" />
        </div>
      </div>

      {/* Senior Secondary Section (Priority) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
            SS
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Senior Secondary School</h2>
            <p className="text-sm text-slate-500">Grades 10-12 • Sciences & Mathematics focus</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedCourses['Senior Secondary'].map(renderCourseCard)}
        </div>
      </section>

      {/* Tertiary & Skills Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
            IT
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Professional Skills & ICT</h2>
            <p className="text-sm text-slate-500">Coding, Digital Literacy & Technical Skills</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedCourses['Tertiary & Skills'].map(renderCourseCard)}
        </div>
      </section>

      {/* Junior Secondary Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <div className="w-10 h-10 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
            JS
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Junior Secondary School</h2>
            <p className="text-sm text-slate-500">Grades 7-9 • Integrated Science & Foundations</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedCourses['Junior Secondary'].map(renderCourseCard)}
        </div>
      </section>

    </div>
  );
};

export default LearningHub;
