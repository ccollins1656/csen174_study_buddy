import hashlib
import smtplib
import secrets
from datetime import datetime
import time
import ssl
import hmac
import mysql.connector
from mysql.connector import errorcode

from email.message import EmailMessage

HASH_ITER = 300000  # the number of iterations to hash the password, decrease this number if it takes too long

send_email = 'lucas3rocks@gmail.com'
send_psswrd = 'flpb bmmf xchd mjdx'
PORT = 465  # for sending emails with SSL encryption protocol
DATABASE_NAME = "coen174"  # name of database
TABLE_NAME = "user"  # name of table in database where passwords are stored
database_info = ("localhost", "root", "Passed_Word")  # database login info

"""
This function must be called at start to save the email address and
password for said account that will be sending authentication emails

sending_addr is the email address our authentication emails are sent from
email_psswrd is the password for above email address, this must be an "app password"
for gmail to allow less secure login.
"""


def set_email_info(sending_addr, email_psswrd):
    global send_email
    global send_psswrd
    send_email = sending_addr
    send_psswrd = email_psswrd


"""
Function to change the database info/name from hard coded defaults.

db_name is the name of the database
table_name is the name of the table in the database where the passwords are stored
host is the host ip address
user is the username credential needed to access the database
pswrd is the password used to access the database
"""


def set_db_info(db_name=str, table_name=str, host=str, user=str, pswrd=str):
    global DATABASE_NAME
    global TABLE_NAME
    global database_info
    DATABASE_NAME = db_name
    TABLE_NAME = table_name
    database_info = (host, user, pswrd)


"""
Function for testing whether these functions work.
Creates the database and table for testing. In practice, the database
and tables have likely been created beforehand.

The database_info tuple contains (host, username, password)
"""


def initialize_database():
    table = """create table user (
            user_id varchar(10) not null,
            display_name varchar(20) not null,
            email varchar(40) not null,
            password varchar(64) not null,
            salt varchar(64) not null,
            join_time DATETIME,

            primary key(user_id),
            unique(email)
            );"""

    database = mysql.connector.connect(
        host=database_info[0],
        user=database_info[1],
        password=database_info[2],
    )

    cursor = database.cursor()
    try:
        cursor.execute("USE {}".format(DATABASE_NAME))
    except mysql.connector.Error as err:  # database does not exist
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist, trying to create it")
            try:
                cursor.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DATABASE_NAME))
            except mysql.connector.Error as err2:  # creation failure
                print("Failed to create database. Error: ")
                print(err2)
                exit(1)
        else:  # unknown failure
            print("Unknown error when selecting database. Error: ")
            print(err)
            exit(1)

    try:
        cursor.execute(table)
    except mysql.connector.Error as err:
        if err.errno != errorcode.ER_TABLE_EXISTS_ERROR:
            # if table exists, we ignore
            print(err)

    cursor.close()
    database.close()


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
Helper function that returns the hashed password given the
plaintext password and corresponding salt value. Meant to be
used by the other functions.
Attempts to implement the PBKDF2 algorithm

pswrd is the plaintext password
salt is the random salt value appended to the password before hashing
"""


def hash_password(pswrd, salt):
    # only generate one block as desired key length = hash output length
    new_hashed_section = hmac.new(bytes(str(pswrd), encoding='utf-8'),
                                  bytes(str(salt), encoding='utf-8') + int(1).to_bytes(4, byteorder='big'),
                                  hashlib.sha256).hexdigest()
    final_xor_result = new_hashed_section
    for i in range(HASH_ITER):
        new_hashed_section = hmac.new(bytes(str(pswrd), encoding='utf-8'),
                                      bytes(str(new_hashed_section), encoding='utf-8'), hashlib.sha256).hexdigest()
        final_xor_result = bytes(a ^ b for a, b in zip(str(final_xor_result).encode('utf-8'),
                                                       str(new_hashed_section).encode('utf-8')))
    return final_xor_result.decode("utf-8")


"""
This function changes the password of the account to the new one specified.

email is the email address of the account
new_password is the new password that will replace the old
Returns True if successful, False if no valid account is found
"""


def change_password(email=str, new_password=str):
    connection = connect_to_db()
    if connection is None:
        return False

    query = ("SELECT salt FROM " + TABLE_NAME +
             " WHERE email = %s AND join_time is NULL")
    connection[1].execute(query, (str(email),))
    data = connection[1].fetchall()  # returns list of tuples
    if data:  # check if empty
        for salt in data[0]:  # need the [0] when retrieving a single value to iterate over nested tuple in list
            new_hashed_password = hash_password(new_password, salt)
            update = ("UPDATE " + TABLE_NAME +
                      " SET password = %s "
                      "WHERE email = %s AND join_time is NULL")
            connection[1].execute(update, (new_hashed_password, email))
            connection[0].commit()

            connection[1].close()
            connection[0].close()
            return True

    connection[1].close()
    connection[0].close()
    return False


"""
This function removes accounts that need to be authenticated, and whose
authentication time has run out. After 24 hours, these accounts time out
and will no longer accept authentication. However, they will not be removed
from the table until this method is run.

Returns True on success, False on failure
"""


def clean_account_list():
    connection = connect_to_db()
    if connection is None:
        return False
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    delete = ("DELETE FROM " + TABLE_NAME +
              " WHERE TIMESTAMPDIFF(SECOND, join_time, %s) > 86400")  # 86400 is 24 hours in seconds
    connection[1].execute(delete, (current_time,))
    connection[0].commit()

    connection[1].close()
    connection[0].close()
    return True


"""
This function deletes an account from the database.
Mostly used for testing, could be useful if we get around
to complying with CA privacy laws.

email is the account's associated email
Returns True on success, False if failed to connect with database
True is returned even if there is no matching account
"""


def delete_account(email=str):
    connection = connect_to_db()
    if connection is None:
        return False
    delete = ("DELETE FROM " + TABLE_NAME +
              " WHERE email = %s")
    connection[1].execute(delete, (str(email),))
    connection[0].commit()

    connection[1].close()
    connection[0].close()
    return True


"""
This function is used to log into an account

email is the account email
password is the account password
Returns True if the credentials correspond to a valid account
Returns False if credentials are invalid
"""


def login(email=str, password=str):
    connection = connect_to_db()
    if connection is None:
        return False

    connection[1].callproc("get_user_by_email", (str(email),))
    for result in connection[1].stored_results():
        data = result.fetchall()
        for id, name, email, pwrd, salt, join_time in data:
            hashed_password = hash_password(password, salt)
            if pwrd == hashed_password and join_time is None:
                connection[1].close()
                connection[0].close()
                return True
    connection[1].close()
    connection[0].close()

    return False


"""
This function is used to authenticate a new account
It accepts the account email and the authentication code (sent via email)

Returns True if successful, False otherwise (ex. email invalid)
"""


def auth_account(email, auth_code):
    connection = connect_to_db()
    if connection is None:
        return False
    # get account info
    current_time = time.time()
    connection[1].callproc("get_user_by_email", (email, ))
    for result in connection[1].stored_results():
        data = result.fetchall()  # returns list of tuples
        for id, name, email, pwrd, salt, join_time in data:  # need the [0] when retrieving a single value to iterate over nested tuple in list
            if join_time is not None:
                join_time_sec = int(join_time.timestamp()) + 86400      # 86400 is 24 hr in seconds
                if auth_code == salt and join_time_sec >= current_time:
                    # update the password
                    update = ("UPDATE " + TABLE_NAME + " SET join_time = NULL " +
                              "WHERE email = %s")
                    connection[1].execute(update, (email,))
                    connection[0].commit()
                    connection[1].close()
                    connection[0].close()
                    return True

    connection[1].close()
    connection[0].close()
    return False


"""
This function is used to reset the user's password to
a randomly selected password which is then emailed to them
Returns True on success, False if no valid account is found.

email is the account's associated email
"""


def reset_password(email):
    new_password = secrets.token_hex()
    if change_password(email, new_password):

        context = ssl.create_default_context()
        msg = EmailMessage()
        msg.set_content("Your new StudyBuddy password is: " + new_password)
        with smtplib.SMTP_SSL("smtp.gmail.com", PORT, context=context) as server:
            server.login(send_email, send_psswrd)

            msg['Subject'] = f'StudyBuddy Password Reset'
            msg['From'] = send_email
            msg['To'] = email

            server.sendmail(send_email, str(email), msg.as_string())
            server.quit()
        return True

    return False


"""
This function is used to change the user's display name.

email is the account's associated email
dname is the user's new display name
"""


def change_dname(email, dname):
    connection = connect_to_db()
    if connection is None:
        return False
    
    connection[1].callproc("get_user_view_by_email", (email, ))
    for result in connection[1].stored_results():
        data = result.fetchone()
    user_id = data[0]

    connection[1].callproc("change_display_name", (user_id, dname))
    connection[0].commit()

    connection[1].close()
    connection[0].close()

    return True


"""
This function is called to create a new account.
It sends the authentication email to email_addr.

displayname is the name that will be displayed to other users
email is the account email
password is the account password
True is returned on success, False is returned if a non-scu email is used
or email already in use
"""


def create_account(display_name=str, email=str, password=str):
    # verify that a scu email is used
    index = str(email).find('@')
    if index == -1:
        return False
    elif email[index:] != "@scu.edu":
        return False
    
    # sets default display name to their email
    if display_name == "":
        display_name = email[:index]

    connection = connect_to_db()
    if connection is None:
        return False
    connection[1].callproc("get_user_by_email", (str(email),))
    for result in connection[1].stored_results():
        data = result.fetchall()
        for id, name, email, pwrd, salt, join_time in data:
            if join_time is None:
                return False  # email already in use
            else:
                delete_account(email)

    context = ssl.create_default_context()
    auth_code = secrets.token_hex()  # This code will double as our password salt
    hashed_password = hash_password(password, auth_code)

    msg = EmailMessage()
    url = "http://localhost:3000/auth?email="+str(email)+"&code="+str(auth_code)
    msg.set_content("Your StudyBuddy authentication code is: " + auth_code +
                    "\n\nThis code will expire in 24 hours. You can use the link below to authenticate your account "
                    "(you may need to copy paste the link into your browser):\n\n" + url)

    user_id = (0, )
    connection[1].callproc("get_num_users", user_id)
    user_id = user_id[0]
    query = "SELECT * from " + TABLE_NAME + " WHERE user_id = %s"  # check if id is unique
    connection[1].execute(query, (user_id,))
    while connection[1].fetchall():
        user_id += 1  # just increment to get a unique user_id until we get a unique one
        connection[1].execute(query, (user_id,))

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    connection[1].callproc("insert_into_user", (user_id, display_name, email, hashed_password, auth_code, current_time))
    connection[0].commit()
    connection[1].close()
    connection[0].close()

    with smtplib.SMTP_SSL("smtp.gmail.com", PORT, context=context) as server:
        server.login(send_email, send_psswrd)

        msg['Subject'] = f'StudyBuddy Email Authentication'
        msg['From'] = send_email
        msg['To'] = email

        server.sendmail(send_email, str(email), msg.as_string())
        server.quit()
    return True
