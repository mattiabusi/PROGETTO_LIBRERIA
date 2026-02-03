from flask import Flask, jsonify, request
from flask_cors import CORS
from faker import Faker
import random

# Inizializza Flask e abilita CORS per comunicare con il frontend
app = Flask(__name__)
CORS(app)

# Genera dati fake in italiano
fake = Faker('it_IT')

# Storage in memoria (non persistente)
libri = []
next_id = 1

# Generi disponibili
GENERI = [
    "Narrativa", "Romanzo storico", "Giallo", "Fantasy", "Fantascienza",
    "Saggistica", "Biografia", "Poesia", "Horror", "Romantico"
]

# Crea n libri con dati casuali
def generate_books(n=20):
    global next_id
    books = []
    for _ in range(n):
        book = {
            "id": next_id,
            "titolo": fake.sentence(nb_words=4).rstrip('.'),
            "autore": fake.name(),
            "anno": random.randint(1800, 2023),
            "genere": random.choice(GENERI)
        }
        books.append(book)
        next_id += 1
    return books

# Popola il database all'avvio con 20 libri
libri = generate_books(20)

# Endpoint GET: restituisce tutti i libri
@app.route('/api/libri', methods=['GET'])
def get_libri():
    return jsonify(libri), 200

# Endpoint POST: aggiunge un nuovo libro
@app.route('/api/libri', methods=['POST'])
def add_libro():
    global next_id
    data = request.get_json() or {}
    titolo = data.get('titolo')
    autore = data.get('autore')
    anno = data.get('anno')
    genere = data.get('genere')
    
    # Valida che tutti i campi siano presenti
    if not titolo or not autore or not anno or not genere:
        return jsonify({"error": "campi mancanti"}), 400
    
    # Valida che l'anno sia numerico
    try:
        anno = int(anno)
    except (ValueError, TypeError):
        return jsonify({"error": "anno non valido"}), 400
    
    # Crea il nuovo libro con ID auto-incrementante
    nuovo = {
        "id": next_id,
        "titolo": titolo,}
# Endpoint DELETE: elimina un libro specifico per ID
@app.route('/api/libri/<int:book_id>', methods=['DELETE'])
def delete_libro(book_id):
    global libri
    for b in libri:
        if b['id'] == book_id:
            libri = [x for x in libri if x['id'] != book_id]
            return jsonify({"deleted": book_id}), 200
    return jsonify({"error": "non trovato"}), 404

# Endpoint DELETE: elimina tutti i libri
@app.route('/api/libri', methods=['DELETE'])
def delete_all_libri():
    global libri
    libri = []
    return jsonify({"deleted_all": True}), 200

# Endpoint PUT: modifica un libro esistente
@app.route('/api/libri/<int:book_id>', methods=['PUT'])
def update_libro(book_id):
    data = request.get_json() or {}
    titolo = data.get('titolo')
    autore = data.get('autore')
    anno = data.get('anno')
    genere = data.get('genere')
    
    # Valida i campi
    if not titolo or not autore or not anno or not genere:
        return jsonify({"error": "campi mancanti"}), 400
    
    try:
        anno = int(anno)
    except (ValueError, TypeError):
        return jsonify({"error": "anno non valido"}), 400
    
    # Trova e aggiorna il libro
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