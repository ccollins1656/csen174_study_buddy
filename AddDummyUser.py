"""
This script adds a dummy user to the database.
The user_id will be 100 so this must be an available id.
The user account can be logged in with:
email: dummy@scu.edu
password: 12345
"""

import loginManager as login
import secrets
import mysql.connector
from mysql.connector import errorcode

DATABASE_NAME = "coen174"  # name of database
TABLE_NAME = "user"  # name of table in database where passwords are stored
database_info = ("localhost", "root", "100%TheBestMYSQLPassword")  # database login info

salt = secrets.token_hex()
password = "12345"
email = "dummy@scu.edu"
hashed_password = login.hash_password(password, salt)


"""
Helper function that connects to the database.
Meant to be used by the other functions.

Returns the tuple of (database, cursor) objects on success
Returns None on failure
"""


def connect_to_db():
    try:
        database = mysql.connector.connect(
            host=database_info[0],
            user=database_info[1],
            password=database_info[2],
            database=DATABASE_NAME
        )
        cursor = database.cursor()
        return database, cursor
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Error: Database Access Denied, check the username and password")
            print(err)
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Error: Database does not exist, make sure it was created")
            print(err)
        else:
            print("Unknown error when connecting to the database: ")
            print(err)
        return None

connection = connect_to_db()

connection[1].callproc("insert_into_user", (100, "hi", email, hashed_password, salt, None))
connection[0].commit()
connection[1].close()
connection[0].close()