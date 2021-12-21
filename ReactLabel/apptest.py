# app.py
from flask import Flask,render_template,request,jsonify
from flask_cors import CORS
import json
import pymysql
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
db = pymysql.connect(host='127.0.0.1',user='root',database='labelme',passwd='root12345',port=3306)
CORS(app)
@app.route('/', methods=['GET','POST'])
def index():
    return "1"



@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        sql = "select password,id from user_account where name='%s'"%data["user_name"]
        cursor.execute(sql)
        account = cursor.fetchone()
        if account:
            if account[0] == data['user_pwd']:
                #print("登陆成功")
                msg = {
                    "code": 1,
                    "cookie": {
                        "sessionId": account[1]
                    }
                }
                return "1"
            else:
                return "0"
        else:
            return "用户名不存在"
        db.commit()


if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)