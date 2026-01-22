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
    books = []
    for _ in range(n):
        libro = {
            "id": next_id,
            "titolo": fake.sentence(nb_words=3).rstrip('.'),
            "autore": fake.name(),
            "anno": random.randint(1950, 2024),
            "genere": random.choice(GENERI)
        }
        books.append(libro)
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