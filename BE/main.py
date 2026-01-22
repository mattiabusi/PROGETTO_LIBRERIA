from flask import Flask, jsonify, request
from flask_cors import CORS  # Importa CORS
from faker import Faker

app = Flask(__name__)
CORS(app)  # Abilita CORS per tutte le rotte

fake = Faker('it_IT')

# Qui andrà la logica per generare i 20 libri e le rotte...