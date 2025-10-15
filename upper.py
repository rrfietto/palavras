import sqlite3

def uppercase_words_in_db(db_file):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    try:
        # Fetch all words from the database
        cursor.execute("SELECT word FROM words")
        words = cursor.fetchall()

        # Update each word with its uppercase equivalent
        for word in words:
            uppercase_word = word[0].upper()  # Uppercase each word
            cursor.execute("UPDATE words SET word = ? WHERE word = ?", (uppercase_word, word[0]))

        conn.commit()
        print("Words updated successfully.")
    except sqlite3.Error as e:
        print(f"Error updating words: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    db_file = 'assets/words.db'  # Update this with your database file path
    uppercase_words_in_db(db_file) 

