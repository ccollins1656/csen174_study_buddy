import csv

# Read from the CSV file
with open('tutors_list.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    tutor_list = list(reader)

# Format into JS array
with open('tutors_listOutput.json', 'w') as jsfile:
    jsfile.write('{\n\t"tutorData": [\n')
    for idx, row in enumerate(tutor_list, start=1):
        course = row['Class'].strip()
        tutor = row['Email'].strip()
        jsfile.write(f'\t\t{{ "id": {idx}, "className": "{course}", "tutorName": "{tutor}" }},\n')
    jsfile.write('\t]\n}')
