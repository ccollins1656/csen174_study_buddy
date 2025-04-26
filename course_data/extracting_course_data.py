import fitz 
import pandas as pd

doc = fitz.open(r"C:\Users\ianke\OneDrive\Desktop\csen174_study_buddy\course_data\Spring2025_Schedule.pdf")

all_courses = []
current_subject = None  


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