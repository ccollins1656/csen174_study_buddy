import fitz 
import pandas as pd
import re

doc = fitz.open(r"C:\Users\ianke\OneDrive\Desktop\csen174_study_buddy\course_data\Spring2025_Classes.pdf")

all_courses = []
current_subject = None  

"""
for page in doc:
    blocks = page.get_text("dict")["blocks"]
    for b in blocks:
        if "lines" in b:
            for line in b["lines"]:
                spans = line["spans"]
                for span in spans:
                    text = span["text"].strip()
                    if text.isalpha() and len(text) == 4:
                        current_subject = text
                    elif text.isdigit() and current_subject:
                        course_code = f"{current_subject} {text}"
                        all_courses.append(course_code)
                        current_subject = None  


doc.close()

df = pd.DataFrame(all_courses, columns=["Course"])

df = df.drop_duplicates()

engineering_depts = ["CSEN"]
df = df[df["Course"].str[:4].isin(engineering_depts)]

print(df)
df.to_csv("engineering_courses.csv", index=False)

"""

full_text = ""
for page in doc:
    full_text += page.get_text()

doc.close()

pattern = r"(CSEN\s\d{1,3}[A-Z]?(?:-\d)?)"
matches = re.findall(pattern, full_text)

clean_courses = []
for course in matches:
    if 'L' in course:
        continue
    course = course.split('-')[0]
    clean_courses.append(course)

unique_courses = sorted(set(clean_courses))

df = pd.DataFrame(unique_courses, columns=["Course"])

df.to_csv("courses_offered.csv", index=False)

print(df)