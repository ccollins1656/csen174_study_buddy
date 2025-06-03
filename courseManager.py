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
This function returns the user view given the email account
User view described in database/views.sql
Returns None if user is not found

email is the user's email address
connection is a DB connection, if you already have one
"""


def get_user_view_from_email(email, connection=None):
    local_connection = False
    if connection is None:
        connection = connect_to_db()
        local_connection = True
        if connection is None:
            return None

    connection[1].callproc("get_user_view_by_email", (email, ))
    for result in connection[1].stored_results():
        data = result.fetchone()
        if local_connection:
            connection[1].close()
            connection[0].close()
        return data

    if local_connection:
        connection[1].close()
        connection[0].close()
    return None


"""
This function returns the email given the userid
Returns None if user is not found

userid is the user's email address
connection is a DB connection, if you already have one
"""


def get_user_email_from_id(userid=str, connection=None):
    local_connection = False
    if connection is None:
        connection = connect_to_db()
        local_connection = True
        if connection is None:
            return None

    query = "SELECT email FROM user WHERE user_id = %s"
    connection[1].execute(query, (userid, ))
    data = connection[1].fetchone()

    if local_connection:
        connection[1].close()
        connection[0].close()

    if data:
        return data[0]

    return None


"""
This function returns the user_id from the email.
Returns None if failed to connect to database or user not found.

email is the user's email address
"""


def get_id_from_email(email=str):
    connection = connect_to_db()
    if connection is None:
        return None

    user_id = get_user_view_from_email(email, connection)[0]

    connection[1].close()
    connection[0].close()
    return user_id


"""
This function enables a user to join a group
Returns True on success, False if the group does not exits, the user is already in the group, 
or it cannot connect to database

user_id is the user's id
groupname is the name of the group to join
class_name is the name of the class the group is attached to
"""


def join_group(email=str, groupname=str, class_name=str):
    connection = connect_to_db()
    if connection is None:
        return False
    
    user_id = get_user_view_from_email(email, connection)[0]

    groups = list_groups()
    current_groups = find_groups(email)
    if (groupname, class_name) in groups and (groupname, class_name) not in current_groups:
        connection[1].callproc("join_group", (user_id, groupname, class_name))
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

email is the user's email address
groupname is the name of the group to leave
classname is the name of the class the group is a part of
"""


def leave_group(email=str, groupname=str, class_name=str):
    connection = connect_to_db()
    if connection is None:
        return False
    
    user_id = get_user_view_from_email(email, connection)[0]

    connection[1].callproc("leave_group", (user_id, groupname, class_name))
    connection[0].commit()

    connection[1].callproc("find_group_members", (groupname, class_name))
    for result in connection[1].stored_results():
        data = result.fetchall()
    
    # Delete group if empty
    if not data:
        connection[1].callproc("delete_group", (groupname, class_name))
        connection[0].commit()

    connection[1].close()
    connection[0].close()
    return True


"""
This function creates a group and inserts it in the database
Returns True on success, False if group already exists or cannot connect to database

groupname is the name of the group to create
class_name is the name of the class the group is being created in
meeting_time is the time the group is meeting
meeting_place is the place the group is meeting
"""


def create_group(groupname=str, class_name=str, meeting_time=str, meeting_place=str):
    connection = connect_to_db()
    if connection is None:
        return False

    groups = list_groups()
    if groupname not in groups:
        connection[1].callproc("create_group", (groupname, class_name, meeting_time, meeting_place))
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

email is the email address of the user searching for a group
"""


def find_groups(email=str):
    connection = connect_to_db()
    if connection is None:
        return None

    user_id = get_user_view_from_email(email, connection)[0]

    groups = []
    connection[1].callproc("find_groups", (user_id, ))
    for result in connection[1].stored_results():
        data = result.fetchall()
        for groupname, classname in data:
            groups.append((groupname, classname))     #   we want first and second item in tuple

    connection[1].close()
    connection[0].close()

    return groups


"""
This function creates returns the list members in a group
Returns None if cannot connect to database

group is the name of the group
class_name is the name of the associated class
"""


def find_group_members(group=str, class_name=str):
    connection = connect_to_db()
    if connection is None:
        return None

    members = []
    connection[1].callproc("find_group_members", (group, class_name))
    for result in connection[1].stored_results():
        data = result.fetchall()
        for user_id in data:
            members.append(user_id[0])     #   we want first (and only) item in tuple

    connection[1].close()
    connection[0].close()

    return members

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
        for (groupname, classname, meeting_time, meeting_place) in data:
            groups.append((groupname, classname, meeting_time, meeting_place))

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

    user_id = get_user_view_from_email(email, connection)[0]

    if user_id is None:
        connection[1].close()
        connection[0].close()
        return None
    
    try:
        # Get the courses the user is already enrolled in
        connection[1].callproc("get_user_forums", (user_id, ))
        old_courses = []
        for result in connection[1].stored_results():
            courses_list = result.fetchall()
            for seq in courses_list:
                old_courses.append(seq[0])

        # Get the existing forums
        connection[1].callproc("list_forums")
        forums = []
        for result in connection[1].stored_results():
            forums_list = result.fetchall()
            for seq in forums_list:
                forums.append(seq[0])
        
        # Add courses the user wants to be enrolled in but isn't
        for course in courses:
            if not course in old_courses:
                # Make sure forum exists before enrolling
                if not course in forums:
                    connection[1].callproc("create_forum", (course, ))
                connection[1].callproc("join_forum", (user_id, course, ))
                connection[0].commit()

        # Remove courses the user doesn't want to be enrolled in but is
        for course in old_courses:
            if not course in courses:
                connection[1].callproc("drop_user_from_course", (user_id, course, ))
                connection[0].commit()
    
    except mysql.connector.Error as err:
        print(err)

    # Respond with current course list
    try:
        connection[1].callproc("get_user_forums", (user_id, ))
        new_courses = []
        for result in connection[1].stored_results():
            courses_list = result.fetchall()
            for seq in courses_list:
                new_courses.append(seq[0])
    except mysql.connector.Error as err:
        print(err)
        connection[1].close()
        connection[0].close()
        return False

    connection[1].close()
    connection[0].close()
    return new_courses


"""
This function returns the list of courses a user is currently in.
Returns None if no connection, and False if user doesn't exist or other error.

email is the user's email address
"""


def get_courses(email=str):
    connection = connect_to_db()
    if connection is None:
        return None

    try:
        user_id = get_user_view_from_email(email, connection)[0]

        if user_id is None:
            connection[1].close()
            connection[0].close()
            return False
        
        connection[1].callproc("get_user_forums", (user_id, ))
        forums = []
        for result in connection[1].stored_results():
            forums_list = result.fetchall()
            for seq in forums_list:
                forums.append(seq[0])
    
    except mysql.connector.Error as err:
        print(err)
        connection[1].close()
        connection[0].close()
        return False
    
    connection[1].close()
    connection[0].close()
    return forums


"""
This function returns the list emails of members in a give course.
Returns None if no connection or if the course does not exist.

course is the course in question
"""


def get_course_members(course=str):
    connection = connect_to_db()
    if connection is None:
        return None

    members = []
    try:
        connection[1].callproc("get_users_in_forum", (course, ))
        for result in connection[1].stored_results():
            data = result.fetchall()
            for email in data:
                members.append(email[0])

    except mysql.connector.Error as err:
        print(err)
        connection[1].close()
        connection[0].close()
        return None

    connection[1].close()
    connection[0].close()
    return members

"""
This function gets the latest messages between the two users (order doesn't matter)
Returns list of messages or None if user is not found/could not connect to database

user1: the first user
user2: the second user
"""

def get_latest_dms(user1=str, user2=str):
    connection = connect_to_db()
    if connection is None:
        return None

    messages = []
    try:
        connection[1].callproc("get_direct_messages", (user1, user2, "now()" ))
        for result in connection[1].stored_results():
            data = result.fetchall()
            for (sendUser, recieveUser, timestamp, msgText) in data:
                messages.append((sendUser, recieveUser, timestamp, msgText))

    except mysql.connector.Error as err:
        print(err)
        connection[1].close()
        connection[0].close()
        return None

    connection[1].close()
    connection[0].close()
    return messages

"""
This function sends a new message between the two users (user1 is the sender, user2 is recipient)
Returns True on success, False on failure

send: the sending user
receive: the receiving user
text: the message text
"""

def send_dm(send=str, receive=str, text=str):
    connection = connect_to_db()
    if connection is None:
        return False

    try:
        connection[1].callproc("send_direct_message", (send, receive, "now()", text))
        connection[0].commit()

    except mysql.connector.Error as err:
        print(err)
        connection[1].close()
        connection[0].close()
        return False

    connection[1].close()
    connection[0].close()
    return True