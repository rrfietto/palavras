import sqlite3

# function to create the database and table
def create_database(db_file, txt_file):
    # connect to SQLite database (will create if not exists)
    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    # create table
    c.execute('''CREATE TABLE IF NOT EXISTS words (word text)''')

    # read words from txt file and insert into database
    with open(txt_file, 'r') as f:
        words = f.read().splitlines()
        for word in words:
            c.execute('INSERT INTO words (word) VALUES (?)', (word,))

    # commit changes and close connection
    conn.commit()
    conn.close()

    print(f'Successfully created {db_file} with table word_list.')

if __name__ == '__main__':
    # file paths
    db_file = 'words.db'
    txt_file = 'wordss.txt'

    # create database and table
    create_database('D:/Workspace/learning/palavras/assets/words.db', 'D:/Workspace/learning/palavras/assets/wordss.txt')
