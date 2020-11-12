from flask import Flask, render_template
from flask import Flask, jsonify
from sqlalchemy import create_engine
import pandas as pd
import json
# from config import username
# from config import password
# from config import database

app = Flask(__name__)

# create connection to databse
# engine = create_engine(f"postgresql://{username}:{password}@localhost:5432/{database}")
# conn=engine.connect()

rds_connection_string = "postgres:postgres@localhost:5432/PerfsFracs"
engine = create_engine(f'postgresql://{rds_connection_string}')
conn=engine.connect()




@app.route("/production_data")
def datatest():
    
    data = pd.read_sql("select * from production", conn)
    # print(data)
    datatojson = data.to_json(orient = "index")
    parsed = json.loads(datatojson)
    return parsed



# @app.route("/production")
# def data2():
#     data2 = pd.read_sql("SELECT * FROM spcs",conn)
#     #print(data2)
#     var2 = data2.to_json(orient="records")
#     #print(type(var2))
#     return var2

@app.route("/")
def html():   
    return render_template("PerfsFracs.html")


@app.route("/production")
def dashboard():    
    return render_template("production.html")

@app.route("/fracking")
def dashboard2():    
    return render_template("fracking.html")

@app.route("/analysis")
def dashboard3():    
    return render_template("analysis.html")

if __name__ == "__main__":
    app.run(debug=True)