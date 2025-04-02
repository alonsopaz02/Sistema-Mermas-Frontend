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
df = pd.read_csv("D:/Alonso/TESIS/ETL/Inventario Inicial CSV.csv", delimiter=";")

# Convertir fechas con hora aleatoria
def convertir_fecha_con_hora(fecha_str):
    fecha_obj = datetime.strptime(fecha_str, '%m/%d/%Y')
    hora = random.randint(18, 20)
    minuto = random.randint(0, 59)
    fecha_obj = fecha_obj.replace(hour=hora, minute=minuto, second=0)
    return fecha_obj.strftime('%Y-%m-%d %H:%M:%S')

df['fecha'] = df['fecha'].apply(convertir_fecha_con_hora)

# 🔧 Limpiar comas y convertir a float
df['inventario_obs'] = df['inventario_obs'].astype(str).str.replace(",", "").astype(float)
df['inventario_60'] = df['inventario_60'].astype(str).str.replace(",", "").astype(float)

# Insertar los datos en la tabla 'consumo_tanque'
for index, row in df.iterrows():
    tanque_id = row['tanque_id']
    fecha = row['fecha']
    inventario_obs = row['inventario_obs']
    inventario_60 = row['inventario_60']
    responsable = row['responsable']
    comentario = row['comentario']

    # Construir la consulta SQL
    query = """
    INSERT INTO medicion_inventario (tanque_id, fecha, inventario_obs, inventario_60, responsable, comentario)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    # Ejecutar la consulta con los valores
    cursor.execute(query, (tanque_id, fecha, inventario_obs, inventario_60, responsable, comentario))

# Confirmar los cambios
conn.commit()

# Cerrar la conexión
cursor.close()
conn.close()

print("Datos insertados correctamente.")
