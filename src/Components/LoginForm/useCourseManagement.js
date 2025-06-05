import { useState, useEffect } from 'react';
import axios from 'axios';
import host from './host.json' with { type: 'json' };

/*
 * Get the user's course list.
 * setCourseState() is the setter function for the course state variable.
 * 
 * If successful, the state variable will be set to the course list.
 * If unsuccessful, the state variable will be set to an empty list.
*/
export function useGetCourses(setCourseState) {
    const token = localStorage.getItem('session');

    useEffect(() => {
        const getCourses = async () => {
            const response = await axios.post(host.domain + ':5000/get-courses', {
                "token": token
            }).catch(function (e) {
                // Issue reaching the server or processing request
                console.log(e);
                return [];
            });
            if (!response || !(response.status === 200)) {
                // It broke
                return [];
            }
            else  {
                console.log(response.data);
                setCourseState(response.data);
                return response.data;
            }
        }

        getCourses();
    }, []);
}

/*
 * Get and update the user's course list.
 * setCourseState() is the setter function for the course state variable.
 * 
 * If successful, the state variable will be set to the new course list.
 * If unsuccessful, the state variable will be returned to what it was before.
 * 
 * Returns a callable setter. When used to set a course list, that list will be used to
 * update the user's course registration.
*/
export function useUpdateCourses(setCourseState) {
    const token = localStorage.getItem('session');
    const [coursesLocal, setCoursesLocal] = useState(-1);

    useEffect(() => {
        async function updateCourses(courses) {
            // Don't update on init
            if (courses === -1) {
                return;
            }

            // Filter course names
            let course_names = [];
            courses.forEach(function(course) {
                course_names.push(course.full_name);
            });

            const response = await axios.post(host.domain + ':5000/update-courses', {
                "token": token,
                "courses": JSON.stringify(course_names)
            }).catch(function (e) {
                // Issue reaching the server or processing request
                console.log(e);
                setCourseState(courses);
                return;
            });
            if (!response || !(response.status === 200)) {
                // It broke
                setCourseState(courses);
                return;
            }
            else {
                setCourseState(response.data);
                return;
            }
        }

        updateCourses(coursesLocal);
    }, [coursesLocal]);

    return setCoursesLocal;
}