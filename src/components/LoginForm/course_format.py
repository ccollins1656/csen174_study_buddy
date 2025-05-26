import csv

# Read from the CSV file
with open('courses_offered.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    course_list = list(reader)

# Format into JS array
with open('courseData_output.js', 'w') as jsfile:
    jsfile.write('const courseData = [\n')
    for idx, row in enumerate(course_list, start=1):
        course = row['Course'].strip()
        jsfile.write(f"  {{ id: {idx}, full_name: '{course}' }},\n")
    jsfile.write('];\n')
