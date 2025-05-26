import mysql.connector
from mysql.connector import errorcode

DATABASE_NAME = "coen174"  # name of database
database_info = ("localhost", "root", "Passed_Word")  # database login info


"""
Function to change the database info/name from hard coded defaults.

db_name is the name of the database
table_name is the name of the table in the database where the passwords are stored
host is the host ip address
user is the username credential needed to access the database
pswrd is the password used to access the database
"""


def set_db_info(db_name=str, host=str, user=str, pswrd=str):
    global DATABASE_NAME
    global database_info
    DATABASE_NAME = db_name
    database_info = (host, user, pswrd)


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


"""
This function enables a user to join a group
Returns True on success, False if the group does not exits, the user is already in the group, 
or it cannot connect to database

email is the user's email address
groupname is the name of the group to join
"""


def join_group(email=str, groupname=str):
    connection = connect_to_db()
    if connection is None:
        return False

    groups = list_groups()
    current_groups = find_groups(email)
    if groupname in groups and groupname not in current_groups:
        connection[1].callproc("join_group", (email, groupname))
        connection[0].commit()

        connection[1].close()
        connection[0].close()
        return True

    connection[1].close()
    connection[0].close()
    return False


"""
This function enables a user to leave a group
Returns True on success, False if cannot connect to database

user_id is the user's user_id
groupname is the name of the group to leave
"""


def leave_group(user_id=str, groupname=str):
    connection = connect_to_db()
    if connection is None:
        return False

    connection[1].callproc("leave_group", (user_id, groupname))
    connection[0].commit()

    connection[1].close()
    connection[0].close()
    return True


"""
This function creates a group and inserts it in the database
Returns True on success, False if group already exists or cannot connect to database

groupname is the name of the group to create
class_name is the name of the class the group is being created in
"""


def create_group(groupname=str, class_name=str):
    connection = connect_to_db()
    if connection is None:
        return False

    groups = list_groups()
    if groupname not in groups:
        connection[1].callproc("create_group", (groupname, class_name))
        connection[0].commit()

        connection[1].close()
        connection[0].close()
        return True

    connection[1].close()
    connection[0].close()
    return False


"""
This function creates returns the list of groups a user is in
Returns None if cannot connect to database

user_id is user_id of the user in question
"""


def find_groups(user_id=str):
    connection = connect_to_db()
    if connection is None:
        return None

    groups = []
    connection[1].callproc("find_groups", (user_id, ))
    for result in connection[1].stored_results():
        data = result.fetchall()
        for groupname in data:
            groups.append(groupname[0])     #   we want first (and only) item in tuple

    connection[1].close()
    connection[0].close()

    return groups


"""
This function creates returns the list of existing groups
Returns None if cannot connect to database
"""


def list_groups():
    connection = connect_to_db()
    if connection is None:
        return None

    groups = []
    connection[1].callproc("list_groups")
    for result in connection[1].stored_results():
        data = result.fetchall()
        for groupname in data:
            groups.append(groupname[0])     #   we want first (and only) item in tuple

    connection[1].close()
    connection[0].close()

    return groups
