from flask import Flask, request
from flask_cors import CORS
import loginManager as loginManager
import courseManager as courseManager
import secrets
import time
import json

app = Flask(__name__)
CORS(app)


loginManager.set_email_info("lucas3rocks@gmail.com", "flpb bmmf xchd mjdx")
loginManager.set_db_info("coen174", "user", "localhost", "root", "Passed_Word")
courseManager.set_db_info("coen174", "localhost", "root", "Passed_Word")
sessions = {}
EXPIRY_TIME = 86400 # Session length in seconds if "remember me" not checked
EXPIRY_TIME_REMEMBER = EXPIRY_TIME * 7 # If "remember me" is checked
print('Setup completed')


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
API request to courseManager.join_group().
Expects:
{
    "token": session token
    "group_name": name of the group
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
        return response, 204
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
        data = '{'
        for n, i in enumerate(response):
            data += f'"{n}": {i}, '
        data = data[:-2]
        data += '}'
        print(data)
        return data, 200
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
    
    new_courses = list(courseManager.update_courses(email, courses))

    if new_courses == courses:
        return json.dumps(new_courses), 200
    elif new_courses == False:
        return '', 400
    elif new_courses != courses:
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

    if courses:
        return json.dumps(courses), 200
    else:
        return '', 500
