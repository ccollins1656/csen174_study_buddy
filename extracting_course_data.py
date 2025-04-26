import fitz  # PyMuPDF
import pandas as pd

doc = fitz.open(r"C:\Users\ianke\OneDrive\Desktop\csen174_study_buddy\Spring2025_Schedule.pdf")

all_courses = []
current_subject = None  # Remember the last subject we saw

for page in doc:
    blocks = page.get_text("dict")["blocks"]

    for b in blocks:
        if "lines" in b:
            for line in b["lines"]:
                spans = line["spans"]
                for span in spans:
                    text = span["text"].strip()

                    # If the text is 4 letters (e.g., COEN, ELEN)
                    if text.isalpha() and len(text) == 4:
                        current_subject = text
                    # If the text is numbers (course number)
                    elif text.isdigit() and current_subject:
                        course_code = f"{current_subject} {text}"
                        all_courses.append(course_code)
                        current_subject = None  # Reset after use

doc.close()

# Build DataFrame
df = pd.DataFrame(all_courses, columns=["Course"])

# Remove duplicates
df = df.drop_duplicates()

# Filter for engineering departments
engineering_depts = ["CSEN", "ECEN", "MECH", "CENG", "BIOE", "AMTH", "ENGR"]
df = df[df["Course"].str[:4].isin(engineering_depts)]

# Show the result
print(df)
df.to_csv("engineering_courses.csv", index=False)