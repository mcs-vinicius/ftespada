from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # libera chamadas cross-origin para frontend

# Configurações do banco MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'ranking_system'

mysql = MySQL(app)


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
