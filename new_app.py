from flask import Flask, render_template
from flask import Flask, jsonify
from sqlalchemy import create_engine
import pandas as pd

app = Flask(__name__)

@app.route("/")
def html():
    
    return render_template("PerfsFracs_test.html")

if __name__ == "__main__":
    app.run(debug=True)