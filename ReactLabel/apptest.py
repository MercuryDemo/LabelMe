# app.py
import os
from flask import Flask,render_template,request,jsonify
from flask_cors import CORS
import json
import pymysql
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
basedir = os.path.abspath(os.path.dirname(__file__))
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
                return jsonify(msg)
            else:
                msg={
                    "code":0,
                    "error":"密码错误"
                }
                return jsonify(msg)
        else:
            msg={
                    "code":0,
                    "error":"用户名不存在"
                }
            return jsonify(msg)
        
@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        sql = "select * from user_account where name='%s'" % data["user_name"]
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"用户名已存在"}
        sql = "select * from user_account where mail='%s'" % data["user_mail"]
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"邮箱已存在"}
        sql = "insert into user_account values(null,'{name}','{pw}','{email}')"
        sql = sql.format(name=data["user_name"],pw=data["user_pwd"],email=data['user_mail'])
        cursor.execute(sql)
        db.commit()
        # print("成功")
        msg = {'code': 1}
        return jsonify(msg)

@app.route('/test', methods=['GET','POST'])
def test():
    if request.method == 'POST':
        print("comehere")
        print(request)
        
        imgDatas = request.files.getlist('files[]')
        for imgData in imgDatas:
        
            
            print(imgData)
            # 设置图片要保存到的路径
            path = basedir + "\\upload\\img\\"
            # print(path)

            #  获取图片名称及后缀名
            imgName = imgData.filename
            # print(imgName)
            # # 图片path和名称组成图片的保存路径
            file_path = path + imgName
            # print(file_path)
            # # 保存图片
            imgData.save(file_path)

            # # url是图片的路径
            # url = '/upload/img/' + imgName
        
        
        return "1"


if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)
