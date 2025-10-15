from flask import Flask, render_template
import sqlite3
import os
import random

app = Flask(__name__)





# get random words from the database
def get_random_words(num_words=8):
    conn = sqlite3.connect('assets/words.db')
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM words")
    count = cursor.fetchone()[0]
    chosen_words = []

    def random_word():
        rand = random.randint(0, count - 1)
        cursor.execute("SELECT * FROM words LIMIT 1 OFFSET ?", (rand,))
        chosen_word = cursor.fetchone()
        return chosen_word[0] if chosen_word else None

    while len(chosen_words) < num_words:
        chosen_word = random_word()
        if chosen_word and len(chosen_word) <= 8:
            chosen_words.append(chosen_word)

    conn.close()
    return chosen_words

# place words in the grid
def place_words(words, grid_size=16):
    grid = [['' for _ in range(grid_size)] for _ in range(grid_size)]
    directions = [(0, 1), (1, 0), (1, 1), (1, -1)]
    reversed = ['normal', 'reversed']

    for word in words:
        reverse = random.choice(reversed)
        if reverse == 'reversed':
            word = word[::-1]

        placed = False
        while not placed:
            start_row = random.randint(0, grid_size - 1)
            start_col = random.randint(0, grid_size - 1)
            direction = random.choice(directions)


            end_row = start_row + direction[0] * (len(word) - 1)
            end_col = start_col + direction[1] * (len(word) - 1)




            if 0 <= end_row < grid_size and 0 <= end_col < grid_size:
                fits = True
                row, col = start_row, start_col


                for letter in word:
                    if grid[row][col] != '':
                        fits = False
                        break
                    row += direction[0]
                    col += direction[1]

                if fits:
                    row, col = start_row, start_col
                    for letter in word:
                        grid[row][col] = letter
                        row += direction[0]
                        col += direction[1]
                    placed = True

    return grid

# fill empty buttons in the grid with random letters
def fill_empty_buttons(grid, grid_size=16):
    alphabet = 'abcdefghijklmnopqrstuv'
    for row in range(grid_size):
        for col in range(grid_size):
            if grid[row][col] == '':
                grid[row][col] = random.choice(alphabet)
    return grid

# flask route for the main page
@app.route('/')
def main_index():
    try:
        random_words = get_random_words()
        grid = place_words(random_words)
        filled_grid = fill_empty_buttons(grid)
        return render_template('index.html', grid=filled_grid, words=random_words)
    except Exception as e:
        app.logger.error(f"Error in index route: {e}")
        return "Internal Server Error", 500

if __name__ == '__main__':
    app.run(debug=True)
