from flask import Flask, request
from flask_cors import CORS
import loginManager as loginManager;
import secrets;
import time;

app = Flask(__name__)
CORS(app)


loginManager.set_email_info("lucas3rocks@gmail.com", "flpb bmmf xchd mjdx")
loginManager.set_db_info("coen174", "user", "localhost", "root", "Passed_Word")
loginManager.initialize_database()
sessions = {}
EXPIRY_TIME = 3600 # Session length in seconds if "remember me" not checked
print('Setup completed')


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
    response = sessions[r["token"]]
    if response and (response["expires"] == -1 or response["expires"] > time.time()):
        return '', 204
    elif response:
        # Session is expired
        sessions.pop(response)
        return '', 401
    else:
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
        expires = -1 if r["remember"] else int(time.time() + EXPIRY_TIME)
        sessions[token] = {
            "email": r["email"],
            "expires": expires
        }
        return '{"token": "' + token + '"}', 200
    else:
        return '', 401


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
