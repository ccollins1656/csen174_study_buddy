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
Helper function to get a user view from their email address.
Returns the view tuple on success, False if the user does not exist or
it cannot connect to the database.

connection is your current connection
email is the user's email address
"""


def get_user_view_from_email(connection, email=str):
    if connection is None:
        return None
    
    connection[1].callproc("get_user_view_by_email", (email, ))

    try:
        user = next(connection[1].stored_results()).fetchall()
    except mysql.connector.Error as err:
        print(err)
        return False

    if user[0]:
        return user[0]
    else:
        return False


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
    connection[1].callproc("list_groups")   #   might update to search by class name
    for result in connection[1].stored_results():
        data = result.fetchall()
        for groupname in data:
            groups.append(groupname[0])     #   we want first (and only) item in tuple

    connection[1].close()
    connection[0].close()

    return groups


"""
This function updates a user's course selection.

email is the user's email address
courses is a list of their enrolled courses
"""


def update_courses(email=str, courses=[str]):
    connection = connect_to_db()
    if connection is None:
        return None

    user_id = get_user_view_from_email(connection, email)[0]

    if user_id is None:
        connection[1].close()
        connection[0].close()
        return None
    
    try:
        # Get the courses the user is already enrolled in
        connection[1].callproc("get_user_forums", (user_id, ))
        old_courses = []
        for result in connection[1].stored_results():
            old_courses = result.fetchall()

        connection[1].callproc("list_forums")
        forums = []
        for result in connection[1].stored_results():
            forums = result.fetchall()
        
        # Add courses the user wants to be enrolled in but isn't
        for course in courses:
            if not course in old_courses:
                if not course in forums:
                    connection[1].callproc("create_forum", (course, ))
                    connection[0].commit() # is this skippable?
                    print("Created course forum: " + course)
                connection[1].callproc("join_forum", (user_id, course, )) # breaking because forum must be made first
                connection[0].commit()
                print("Added course: " + course)

        # Remove courses the user doesn't want to be enrolled in but is
        for course in old_courses:
            if not course in courses:
                connection[1].callproc("drop_user_from_course", (user_id, course, ))
                connection[0].commit()
                print("Dropped course: " + course)
    
    except mysql.connector.Error as err:
        print(err)

    # Respond with current course list
    connection[1].callproc("get_user_forums", (user_id, ))
    try:
        new_courses = next(connection[1].stored_results()).fetchall()
    except mysql.connector.Error as err:
        print(err)
        connection[1].close()
        connection[0].close()
        return False

    connection[1].close()
    connection[0].close()
    return new_courses