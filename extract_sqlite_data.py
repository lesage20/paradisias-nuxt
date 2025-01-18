import sqlite3
import json
from datetime import datetime

def convert_datetime(value):
    if isinstance(value, str):
        try:
            return datetime.strptime(value, '%Y-%m-%d %H:%M:%S').isoformat()
        except:
            return value
    return value

def extract_hotel_tables():
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    
    # Récupérer toutes les tables qui commencent par 'hotel_'
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'hotel_%'")
    tables = cursor.fetchall()
    
    data = {}
    
    for table in tables:
        table_name = table[0]
        cursor.execute(f"SELECT * FROM {table_name}")
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        
        # Convertir les données en dictionnaire
        table_data = []
        for row in rows:
            row_dict = {}
            for i, column in enumerate(columns):
                value = row[i]
                # Convertir les dates en format ISO
                value = convert_datetime(value)
                row_dict[column] = value
            table_data.append(row_dict)
        
        # Stocker les données de la table
        data[table_name] = table_data
    
    conn.close()
    
    # Écrire les données dans un fichier JSON
    with open('hotel_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    extract_hotel_tables()