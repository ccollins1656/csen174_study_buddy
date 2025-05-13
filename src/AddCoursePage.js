// src/AddCoursePage.js
//import LoginGate from './components/LoginGate'; // This page requires login
import { useState } from 'react';
import courseList from './courselist'; // adjust path as needed

//export default function AddCoursePage() {
  //return (
    //<div className="min-h-screen flex items-center justify-center bg-gray-100">
      //<LoginGate />
      //<h1 className="text-3xl font-bold"> Add a Course </h1>
      //{/* Add your course form here */}
    //</div>
  //);
//}

export default function AddCoursePage() {
  const [query, setQuery] = useState('');
  //const [addedCourses, setAddedCourses] = useState([]);
  const [selected, setSelected] = useState(null);

  const filteredCourses = courseList.filter(course =>
    course.toLowerCase().includes(query.toLowerCase()) &&
    query.trim() !== '' &&
    course !== selected
  );

  //const handleAdd = (course) => {
    //if (!addedCourses.includes(course)) {
      //setAddedCourses([...addedCourses, course]);
    //}
  //};

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl px-6 relative">
        <h2 className="text-4xl font-bold text-center mb-8">Search for a Course</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null); // reset on typing
          }}
          placeholder="e.g., CSEN 174"
          className="w-full text-2xl px-6 py-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Only show dropdown if there are matches */}
        {filteredCourses.length > 0 && (
  <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow mt-2 z-10 max-h-60 overflow-y-auto" style={{ listStyleType: 'none', paddingLeft: 0 }}>
    {filteredCourses.map((course, idx) => (
      <li
        key={idx}
        onClick={() => {
          setQuery(course);
          setSelected(course);
        }}
        className="px-6 py-3 hover:bg-blue-100 cursor-pointer"
      >
        {course}
      </li>
    ))}
  </ul>
)}


        {/* Optional: show what was selected */}
        {selected && (
          <p className="mt-6 text-center text-lg text-green-600">
            You selected: <strong>{selected}</strong>
          </p>
        )}
      </div>
    </div>
  );
}