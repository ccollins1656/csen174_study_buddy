from flask import Flask, request
from flask_cors import CORS
import loginManager as loginManager
import courseManager as courseManager
import secrets
import time
import json

EXPIRY_TIME = 86400 # Session length in seconds if "remember me" not checked
EXPIRY_TIME_REMEMBER = EXPIRY_TIME * 7 # If "remember me" is checked

SESSIONS_FPATH = 'sessions.json'


"""
Helper function to load session information from a local json file.
"""

def load_sessions():
    try:
        with open(SESSIONS_FPATH, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}
    except Exception as e:
        print(f'Error loading saved session tokens: {e}')
        return {}


"""
Helper function to save session infromation to a local json file.
"""

def save_sessions(sessions):
    try:
        with open(SESSIONS_FPATH, 'w') as file:
            json.dump(sessions, file, indent=4)
    except Exception as e:
        print(f'Error saving session tokens: {e}')


"""
Performs server setup.
"""

def main():
    global app, sessions

    app = Flask(__name__)
    CORS(app)

    sessions = load_sessions()

    loginManager.set_email_info("lucas3rocks@gmail.com", "flpb bmmf xchd mjdx")
    loginManager.set_db_info("coen174", "user", "localhost", "root", "100%TheBestMYSQLPassword")
    courseManager.set_db_info("coen174", "localhost", "root", "100%TheBestMYSQLPassword")

    print('Setup completed')
main()


"""
Helper function to verify that a token corresponds to a valid session.
Will delete the session if it is expired.
"""

def token_auth(token):
    if token in sessions:
        response = sessions[token]
    else:
        # Session does not exist
        return False
    
    if (response["expires"] == -1 or response["expires"] > time.time()):
        # Session exists and is current
        return response["email"]
    else:
        # Session exists but is expired
        sessions.pop(response)
        save_sessions(sessions)
        return False


"""
Verifies that a specific session is active.
Expects:
{
    "token": session token
}
"""

@app.route('/session', methods=['POST'])
def session():
    r = request.get_json()
    response = token_auth(r["token"])
    if response:
        # Session healthy
        return '', 204
    else:
        # Could not authenticate
        return '', 401


"""
API request to loginManager.login().
Expects:
{
    "email": user's email address,
    "password": user's password
}
On a successful request, returns a session ID token.
"""

@app.route('/login', methods=['POST'])
def login():
    r = request.get_json()
    response = loginManager.login(r["email"], r["password"])
    if response:
        token = secrets.token_hex()
        lifetime = EXPIRY_TIME if r["remember"] else EXPIRY_TIME_REMEMBER
        expires = int(time.time() + lifetime)
        sessions[token] = {
            "email": r["email"],
            "expires": expires
        }
        save_sessions(sessions)
        return '{"token": "' + token + '"}', 200
    else:
        return '', 401


"""
API request to close a session prematurely.
Expects:
{
    "token": session token
}
"""

@app.route('/logout', methods=['POST'])
def logout():
    r = request.get_json()
    sessions.pop(r["token"])
    save_sessions(sessions)
    return '', 204


"""
API request to loginManager.auth_account().
Expects:
{
    "email": user's email address,
    "auth_code": authentication code for the account
}
"""

@app.route('/auth-account', methods=['POST'])
def auth_account():
    r = request.get_json()
    response = loginManager.auth_account(r["email"], r["auth_code"])
    if response:
        return '', 204
    else:
        return '', 401


"""
API request to loginManager.create_account().
Expects:
{
    "display_name": user's display name,
    "email": user's email address,
    "password": user's password
}
"""

@app.route('/create-account', methods=['POST'])
def create_account():
    r = request.get_json()
    response = loginManager.create_account(r["display_name"], r["email"], r["password"])
    if response:
        return '', 204
    else:
        return '', 401


"""
API request to loginManager.change_password().
Expects:
{
    "token": session token,
    "password": user's new password
}
"""

@app.route('/change-password', methods=['POST'])
def change_password():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    response = loginManager.change_password(email, r["password"])
    if response:
        return '', 204
    else:
        return '', 500


"""
API request to loginManager.change_dname().
Expects:
{
    "token": session token,
    "dname": user's new display name
}
"""

@app.route('/change-dname', methods=['POST'])
def change_dname():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    response = loginManager.change_dname(email, r["dname"])
    if response:
        return '', 204
    else:
        return '', 500


"""
API request to courseManager.create_group().
Expects:
{
    "token": session token,
    "group_name": name of the new group,
    "class_name": class associated with the group
}
"""

@app.route('/create-group', methods=['POST'])
def create_group():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    response = courseManager.create_group(r["group_name"], r["class_name"])
    if response:
        return '', 204
    else:
        return '', 500


"""
API request to courseManager.get_id_from_email().
Expects:
{
    "token": session token
}
"""


@app.route('/get-id-from-email', methods=['POST'])
def get_id_from_email():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401

    response = courseManager.get_id_from_email(email)
    if response is not None:
        return response, 200
    else:
        return '', 500


"""
API request to courseManager.join_group().
Expects:
{
    "token": session token
    "group_name": name of the group
    "class_name": class associated with the group
}
"""

@app.route('/join-group', methods=['POST'])
def join_group():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    response = courseManager.join_group(email, r["group_name"], r["class_name"])
    if response:
        return '', 204
    else:
        return '', 500


"""
API request to courseManager.leave_group().
Expects:
{
    "token": session token
    "group_name": name of the group
    "class_name": class associated with the group
}
"""

@app.route('/leave-group', methods=['POST'])
def leave_group():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401

    response = courseManager.leave_group(email, r["group_name"], r["class_name"])
    if response:
        return '', 204
    else:
        return '', 500

"""
API request to courseManager.find_groups().
Expects:
{
    "token": session token
}
"""

@app.route('/find-groups', methods=['POST'])
def find_groups():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    response = courseManager.find_groups(email)
    if response is not None:
        data = json.dumps(response)
        return data, 200
    else:
        return '', 500


"""
API request to courseManager.get_user_view_from_email() that returns the display_name and email.
Expects:
{
    "token": session token
    "user_id": user id
{"""
@app.route('/get-user-view', methods=['POST'])
def get_user_view_from_email():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401

    user_email = courseManager.get_user_email_from_id(r["user_id"])
    if user_email:
        data = courseManager.get_user_view_from_email(user_email)
        if data:
            response = '{ \"display_name\": \"' + data[1] + '\", \"email\": \"' + data[2] + '\" }'
            return response, 200
    return '', 500




"""
API request to courseManager.find_group_members().
Expects:
{
    "token": session token
    "group_name": name of the group
    "class_name": class associated with the group
}
"""


@app.route('/find-group-members', methods=['POST'])
def find_group_members():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401

    response = courseManager.find_group_members(r["group_name"], r["class_name"])
    if response is not None:
        return json.dumps(response), 200
    else:
        return '', 500


"""
API request to courseManager.list_groups().
Expects:
{
    "token": session token
}
"""

@app.route('/list-groups', methods=['POST'])
def list_groups():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    response = courseManager.list_groups()
    if response is not None:
        return json.dumps(response), 200
    else:
        return '', 500


"""
API request to courseManager.update_courses().
Expects:
{
    "token": session token,
    "courses": ["their full course selection as a list of string names", ]
}
"""

@app.route('/update-courses', methods=['POST'])
def update_courses():
    r = request.get_json()
    courses = json.loads(r["courses"])
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    new_courses = courseManager.update_courses(email, courses)
    course_data = []
    try:
        with open('./src/Components/LoginForm/courseData_output.json') as file:
            course_data = json.load(file)["courses"]
    except:
        return '', 500
    
    # Need to return courses in the right format
    response = []
    for course in new_courses:
        r = None
        for row in course_data:
            if row["full_name"] == course:
                r = row
                break
        response.append(r)
        if r == None:
            return '', 500

    if new_courses.sort() == courses.sort():
        return json.dumps(response), 200
    elif new_courses == False:
        return '', 400
    else:
        print("new_courses:")
        print(new_courses)
        print("courses:")
        print(courses)
        return '', 500


"""
API request to courseManager.get_courses().
Expects:
{
    "token": session token
}
"""

@app.route('/get-courses', methods=['POST'])
def get_courses():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401
    
    courses = courseManager.get_courses(email)
    course_data = []
    try:
        with open('./src/Components/LoginForm/courseData_output.json') as file:
            course_data = json.load(file)["courses"]
            file.close()
    except:
        print('Could not load course data')
        return '', 500
    
    # Need to return courses in the right format
    response = []
    for course in courses:
        r = None
        for row in course_data:
            if row["full_name"] == course:
                r = row
                break
        response.append(r)
        if r == None:
            print('Could not find course in data')
            return '', 500
    
    if not courses is None:
        return json.dumps(response), 200
    else:
        print('No courses')
        print(courses)
        return '', 500

"""
API request to courseManager.get_course_members().
Expects:
{
    "token": session token
    "course": the course to have its members returned
}
"""

@app.route('/get-course-members', methods=['POST'])
def get_course_members():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401

    response = courseManager.get_course_members(r["course"])
    if response is not None:
        return json.dumps(response), 200
    else:
        return '', 500

"""
API request to courseManager.get_latest_dms().
Expects:
{
    "token": session token
    "user1": the first user
    "user2": the second user
}
"""

@app.route('/get-direct-messages', methods=['POST'])
def get_direct_messages():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401

    response = courseManager.get_latest_dms(r["user1"], r["user2"])
    if response is not None:
        return json.dumps(response), 200
    else:
        return '', 500

"""
API request to courseManager.send_dm().
Expects:
{
    "token": session token
    "send": the sending user
    "receive": the receiving user
    "text": the msg text
}
"""

@app.route('/send-direct-message', methods=['POST'])
def send_direct_messages():
    r = request.get_json()
    email = token_auth(r["token"])
    if not email:
        return '', 401

    response = courseManager.send_dm(r["send"], r["receive"], r["text"])
    if response:
        return '', 204
    else:
        return '', 500