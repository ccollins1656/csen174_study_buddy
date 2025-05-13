from flask import Flask, request
from flask_cors import CORS
import loginManager as loginManager;

app = Flask(__name__)
CORS(app)


"""
API request to loginManager.login().
Expects:
{
    "email": user's email address,
    "password": user's password
}
"""

@app.route('/login', methods=['POST'])
def login():
    r = request.get_json()
    response = loginManager.login(r["email"], r["password"])
    if response:
        return '', 204
    else:
        return '', 400


"""
API request to loginManager.auth_account().
Expects:
{
    "email": user's email address,
    "auth_code": authentication code for the account
}
"""

@app.route('/auth', methods=['POST'])
def auth_account():
    r = request.get_json()
    response = loginManager.auth_account(r["email"], r["auth_code"])
    if response:
        return '', 204
    else:
        return '', 400


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
    print(response)
    if response:
        return '', 204
    else:
        return '', 400


if __name__ == '__main__':
    loginManager.set_email_info("lucas3rocks@gmail.com", "flpb bmmf xchd mjdx")
    loginManager.set_db_info("coen174", "user", "localhost", "root", "Passed_Word")
    loginManager.initialize_database()
    print('Setup completed')
