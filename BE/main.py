from flask import Flask, jsonify, request
from flask_cors import CORS
from faker import Faker
import random

app = Flask(__name__)
CORS(app)

fake = Faker('it_IT')

libri = []
next_id = 1

GENERI = [
    "Narrativa", "Romanzo storico", "Giallo", "Fantasy", "Fantascienza",
    "Saggistica", "Biografia", "Poesia", "Horror", "Romantico"
]

def generate_books(n=20):
    global next_id
    famous_books = [
        {"titolo": "To Kill a Mockingbird", "autore": "Harper Lee", "anno": 1960, "genere": "Narrativa"},
        {"titolo": "1984", "autore": "George Orwell", "anno": 1949, "genere": "Fantascienza"},
        {"titolo": "The Great Gatsby", "autore": "F. Scott Fitzgerald", "anno": 1925, "genere": "Narrativa"},
        {"titolo": "Pride and Prejudice", "autore": "Jane Austen", "anno": 1813, "genere": "Romantico"},
        {"titolo": "The Catcher in the Rye", "autore": "J.D. Salinger", "anno": 1951, "genere": "Narrativa"},
        {"titolo": "Harry Potter and the Philosopher's Stone", "autore": "J.K. Rowling", "anno": 1997, "genere": "Fantasy"},
        {"titolo": "The Lord of the Rings", "autore": "J.R.R. Tolkien", "anno": 1954, "genere": "Fantasy"},
        {"titolo": "The Hobbit", "autore": "J.R.R. Tolkien", "anno": 1937, "genere": "Fantasy"},
        {"titolo": "Dune", "autore": "Frank Herbert", "anno": 1965, "genere": "Fantascienza"},
        {"titolo": "The Chronicles of Narnia", "autore": "C.S. Lewis", "anno": 1950, "genere": "Fantasy"},
        {"titolo": "Moby-Dick", "autore": "Herman Melville", "anno": 1851, "genere": "Narrativa"},
        {"titolo": "War and Peace", "autore": "Leo Tolstoy", "anno": 1869, "genere": "Romanzo storico"},
        {"titolo": "Crime and Punishment", "autore": "Fyodor Dostoevsky", "anno": 1866, "genere": "Giallo"},
        {"titolo": "The Brothers Karamazov", "autore": "Fyodor Dostoevsky", "anno": 1880, "genere": "Narrativa"},
        {"titolo": "Anna Karenina", "autore": "Leo Tolstoy", "anno": 1877, "genere": "Romantico"},
        {"titolo": "The Picture of Dorian Gray", "autore": "Oscar Wilde", "anno": 1890, "genere": "Narrativa"},
        {"titolo": "Dracula", "autore": "Bram Stoker", "anno": 1897, "genere": "Horror"},
        {"titolo": "Frankenstein", "autore": "Mary Shelley", "anno": 1818, "genere": "Horror"},
        {"titolo": "The Adventures of Huckleberry Finn", "autore": "Mark Twain", "anno": 1884, "genere": "Narrativa"},
        {"titolo": "Ulysses", "autore": "James Joyce", "anno": 1922, "genere": "Narrativa"}
    ]
    books = []
    for book in famous_books[:n]:
        book_with_id = book.copy()
        book_with_id["id"] = next_id
        books.append(book_with_id)
        next_id += 1
    return books

# genera libri all'avvio
libri = generate_books(20)

@app.route('/api/libri', methods=['GET'])
def get_libri():
    return jsonify(libri), 200

@app.route('/api/libri', methods=['POST'])
def add_libro():
    global next_id
    data = request.get_json() or {}
    titolo = data.get('titolo')
    autore = data.get('autore')
    anno = data.get('anno')
    genere = data.get('genere')
    if not titolo or not autore or not anno or not genere:
        return jsonify({"error": "campi mancanti"}), 400
    try:
        anno = int(anno)
    except (ValueError, TypeError):
        return jsonify({"error": "anno non valido"}), 400
    nuovo = {
        "id": next_id,
        "titolo": titolo,
        "autore": autore,
        "anno": anno,
        "genere": genere
    }
    libri.append(nuovo)
    next_id += 1
    return jsonify(nuovo), 201

@app.route('/api/libri/<int:book_id>', methods=['DELETE'])
def delete_libro(book_id):
    global libri
    for b in libri:
        if b['id'] == book_id:
            libri = [x for x in libri if x['id'] != book_id]
            return jsonify({"deleted": book_id}), 200
    return jsonify({"error": "non trovato"}), 404

@app.route('/api/libri', methods=['DELETE'])
def delete_all_libri():
    global libri
    libri = []
    return jsonify({"deleted_all": True}), 200

@app.route('/api/libri/<int:book_id>', methods=['PUT'])
def update_libro(book_id):
    data = request.get_json() or {}
    titolo = data.get('titolo')
    autore = data.get('autore')
    anno = data.get('anno')
    genere = data.get('genere')
    if not titolo or not autore or not anno or not genere:
        return jsonify({"error": "campi mancanti"}), 400
    try:
        anno = int(anno)
    except (ValueError, TypeError):
        return jsonify({"error": "anno non valido"}), 400
    for b in libri:
        if b['id'] == book_id:
            b.update({"titolo": titolo, "autore": autore, "anno": anno, "genere": genere})
            return jsonify(b), 200
    return jsonify({"error": "non trovato"}), 404

if __name__ == '__main__':
    app.run(debug=True)