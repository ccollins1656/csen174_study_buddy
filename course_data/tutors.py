import fitz  
import pandas as pd
import re

doc = fitz.open(r"C:\Users\ianke\OneDrive\Desktop\csen174_study_buddy\course_data\Spring2025_Tutoring.pdf")

all_text = ""
for page in doc:
    all_text += page.get_text()

doc.close()

class_pattern = r"([A-Z]{4}\s\d{1,3})"
classes = re.findall(class_pattern, all_text)

email_pattern = r"([a-zA-Z0-9._%+-]+@scu\.edu)"
emails = re.findall(email_pattern, all_text)

paired = list(zip(classes, emails))

df = pd.DataFrame(paired, columns=["Class", "Email"])
df = df[df['Class'].str.startswith('CSEN')]
df.to_excel("tutors_list.xlsx", index=False)
print(df)
