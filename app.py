from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)  # libera chamadas cross-origin para frontend
app.secret_key = os.urandom(24) # Replace with a strong, random key in production

# Configurações do banco MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'ranking_system'

mysql = MySQL(app)

# --- User Management Endpoints ---

@app.route('/register-user', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Nome de usuário e senha são obrigatórios'}), 400

    hashed_password = generate_password_hash(password)

    cur = mysql.connection.cursor()
    try:
        cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
        mysql.connection.commit()
        return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201
    except Exception as e:
        mysql.connection.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({'error': 'Nome de usuário já existe.'}), 409
        return jsonify({'error': 'Erro ao cadastrar usuário.'}), 500
    finally:
        cur.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, password FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    cur.close()

    if user and check_password_hash(user[2], password):
        # For simplicity, using a basic session. In production, consider JWTs.
        session['logged_in'] = True
        session['user_id'] = user[0]
        session['username'] = user[1]
        return jsonify({'message': 'Login bem-sucedido!', 'token': 'dummy-token'}), 200 # Dummy token for frontend
    else:
        return jsonify({'error': 'Credenciais inválidas'}), 401

# --- Protected Route Decorator (Basic) ---
def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            return jsonify({'error': 'Não autorizado. Por favor, faça login.'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/seasons', methods=['GET'])
def get_seasons():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, start_date, end_date FROM seasons ORDER BY id ASC")
    seasons = cur.fetchall()
    result = []
    for s in seasons:
        season_id = s[0]
        cur.execute(
            "SELECT id, name, fase, r1, r2, r3, total FROM participants WHERE season_id=%s",
            (season_id,))
        participants = cur.fetchall()
        participants_list = [{
            'id': p[0],
            'name': p[1],
            'fase': p[2],
            'r1': p[3],
            'r2': p[4],
            'r3': p[5],
            'total': p[6]
        } for p in participants]
        result.append({
            'id': season_id,
            'start_date': s[1].strftime('%Y-%m-%d'),
            'end_date': s[2].strftime('%Y-%m-%d'),
            'participants': participants_list
        })
    cur.close()
    return jsonify(result)


@app.route('/seasons', methods=['POST'])
def create_season():
    data = request.json
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    participants = data.get('participants', [])

    if not start_date or not end_date:
        return jsonify({'error': 'Data de início e fim obrigatórias'}), 400

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO seasons (start_date, end_date) VALUES (%s, %s)", (start_date, end_date))
    season_id = cur.lastrowid

    for p in participants:
        cur.execute("""
            INSERT INTO participants (season_id, name, fase, r1, r2, r3)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (season_id, p['name'], p['fase'], p['r1'], p['r2'], p['r3']))

    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Temporada criada com sucesso!', 'seasonId': season_id}), 201


if __name__ == '__main__':
    app.run(debug=True)
