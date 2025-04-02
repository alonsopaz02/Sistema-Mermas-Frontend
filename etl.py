import pandas as pd
import mysql.connector
from datetime import datetime
import random

# Configuración de la conexión a la base de datos MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",  # Cambia la contraseña si es necesario
    database="tesis"
)
cursor = conn.cursor()

# Cargar el CSV
df = pd.read_csv("D:/Alonso/TESIS/ETL/Otros Egresos CSV.csv", delimiter=";")

# Función para convertir la fecha en formato 'MM/DD/YYYY' a 'YYYY-MM-DD HH:MM:SS'
def convertir_fecha_con_hora(fecha_str):
    # Convierte la fecha a formato 'YYYY-MM-DD'
    fecha_obj = datetime.strptime(fecha_str, '%m/%d/%Y')
    
    # Agrega una hora aleatoria entre las 10 AM y 3 PM
    hora = random.randint(10, 15)
    minuto = random.randint(0, 59)
    fecha_obj = fecha_obj.replace(hour=hora, minute=minuto, second=0)
    
    return fecha_obj.strftime('%Y-%m-%d %H:%M:%S')

# Convertir la columna 'fecha' en el formato adecuado con hora
df['fecha'] = df['fecha'].apply(convertir_fecha_con_hora)

# Insertar los datos en la tabla 'consumo_tanque'
for index, row in df.iterrows():
    tanque_id = row['tanque_id']
    volumen_observado = row['volumen_observado']
    volumen_60 = row['volumen_60']
    fecha = row['fecha']
    descripcion = row['descripcion']
    
    # Construir la consulta SQL
    query = """
    INSERT INTO otras_operaciones (tanque_id, fecha, descripcion, volumen_observado, volumen_60)
    VALUES (%s, %s, %s, %s, %s)
    """
    # Ejecutar la consulta con los valores
    cursor.execute(query, (tanque_id,  fecha, descripcion, volumen_observado, volumen_60))

# Confirmar los cambios
conn.commit()

# Cerrar la conexión
cursor.close()
conn.close()

print("Datos insertados correctamente.")
