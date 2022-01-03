# app.py
import os
import cv2
import xml.dom.minidom as minidom
from flask import Flask,render_template,request,jsonify
from flask.wrappers import Request
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
        
        sql = "select password,userid from accounts where name='%s'"%data["user_name"]
        cursor.execute(sql)
        account = cursor.fetchone()
        if account:
            if account[0] == data['user_pwd']:
                
                msg = {
                    "code": 1,
                    "userid":account[1],
                    "username":data["user_name"]
                    
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
        sql = "select * from accounts where name='%s'" % data["user_name"]
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"用户名已存在"}
        sql = "select * from accounts where mail='%s'" % data["user_mail"]
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"邮箱已存在"}
        sql = "insert into accounts values(null,'{name}','{pw}','{email}')"
        sql = sql.format(name=data["user_name"],pw=data["user_pwd"],email=data['user_mail'])
        cursor.execute(sql)
        db.commit()
     
        msg = {'code': 1}
        return jsonify(msg)

@app.route('/upload', methods=['GET','POST'])
def upload():
    if request.method == 'POST':
        cursor = db.cursor()
        imgDatas = request.files.getlist('files[]')
        for imgData in imgDatas:
            # 设置图片要保存到的路径
            if request.headers['type']=='1':
                path = basedir + "\\frontend\\public\\upload\\img\\"
            else:
                print("hahha")
                path = basedir + "\\frontend\\public\\upload\\video\\"
            #  获取图片名称及后缀名
            imgName = imgData.filename #图片本来的名称
            # 图片path和名称组成图片的保存路径
            imgName=request.headers['user_id']+'_'+imgName #用户id_图片名称
            file_path = path + imgName
            imgData.save(file_path) # 保存图片
            sql = "insert into imgs values(null,'{imgname}','{userid}','{imgurl}','{type}')"
            sql = sql.format(imgname=imgData.filename,userid=request.headers['user_id'],imgurl=imgName,type=request.headers['type'])
            cursor.execute(sql)
            db.commit()
            print(request.headers['type'])
            if request.headers['type']=='0':
                print("hahhahha")
                output_path = basedir + "\\frontend\\public\\upload\\img\\" # 输出文件夹
                video_path = file_path # 视频地址
                print(video_path)
                interval = (int)(request.headers['interval'])  # 每间隔10帧取一张图片
                num = 1
                vid = cv2.VideoCapture(video_path)
                while vid.isOpened():
                    is_read, frame = vid.read()
                    if is_read:
                        if num % interval == 1:
                            file_name = '%08d' % num
                            cv2.imwrite(output_path + str(imgName+'-'+file_name) + '.jpg', frame)
                            # 00000111.jpg 代表第111帧
                            cv2.waitKey(1)
                            sql = "insert into imgs values(null,'{imgname}','{userid}','{imgurl}','{type}')"
                            sql = sql.format(imgname=imgData.filename+'-'+file_name,userid=request.headers['user_id'],imgurl=imgName+'-'+file_name+'.jpg',type=2)
                            cursor.execute(sql)
                            db.commit()
                        num += 1
                    else:
                        break
          
                        
    return "1"


@app.route('/myimg', methods=['GET','POST'])
def get_img():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        
        cursor = db.cursor()
        sql = "select * from imgs where userid='%d' and type>0" % data["user_id"]
        cursor.execute(sql)
        myimgs = cursor.fetchall()
        
        res = []
        for i in range(len(myimgs)):
            res.append({'id':myimgs[i][0],'name':myimgs[i][1],'url':myimgs[i][3]})
        msg = {
            'imgList' : res,
           
        }
        return jsonify(msg)
@app.route('/alltask', methods=['GET','POST'])
def get_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
       
        # return '1'
        # if data['user_id']:    
        #     sql = "select * from tasks where creater='%d'" % data["user_id"]
        # else: 
        sql = "select * from tasks where state<4"#0刚刚发布，可以认领标记，2 刚刚标记结束，可以认领审核
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        
        res = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            
            res.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        msg = {
            'taskList' : res
        }
        return jsonify(msg)
@app.route('/taskhasimg', methods=['GET','POST'])
def get_taskhasimg():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        
        
        sql = "select imgid from taskhasimgs where taskid='%d'" % data['task_id']
        cursor.execute(sql)
        imgList = cursor.fetchall()
       
        res = []
        for i in range(len(imgList)):
            sql="select *from imgs where imgid='%s'" % imgList[i]
            cursor.execute(sql)
            oneimg = cursor.fetchone()
            
            res.append({'id':oneimg[0],'name':oneimg[1],'url':oneimg[3]})
        msg = {
            'imgList' : res
        }
        return jsonify(msg)


@app.route('/mytask', methods=['GET','POST'])
def get_my_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        
        # return '1'
        # if data['user_id']:    
        sql = "select * from tasks where creater='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        
        res1 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            print(coverurl)
            res1.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        sql = "select * from tasks where labeler='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        
        res2 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            
            res2.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        
        sql = "select * from tasks where reviewer='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        
        res3 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            
            res3.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        
        
        
        msg = {
            'CreateTask' : res1,
            'LabelTask':res2,
            'ReviewTask':res3
        }
        return jsonify(msg)

@app.route('/claim', methods=['GET','POST'])
def claim_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        
           
        if data['type']=="label":
            sql = "UPDATE tasks  SET labeler ='{userid}', state = 1  WHERE taskid='{taskid}'" 
        else:    
            sql = "UPDATE tasks  SET reviewer ='{userid}', state = 3  WHERE taskid='{taskid}'" 
        
        sql = sql.format(taskid=data["task_id"],userid=request.headers['user_id'])
        
        
        cursor.execute(sql)
        db.commit()
        msg = {
            'code' : 1,
            'msg':'认领成功',
        }
        return jsonify(msg)

@app.route('/finishtask', methods=['GET','POST'])
def finish_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        # sql = "select state from tasks where taskid='%d'" % data["task_id"]
        # cursor.execute(sql)
        # state=cursor.fetchone()

        if data["type"]=="success":
            sql = "UPDATE tasks SET state=state+1 where taskid='%d'" % data["task_id"]
        else:
            sql = "UPDATE tasks SET state=5 where taskid='%d'" % data["task_id"] #不通过，状态
        cursor.execute(sql)
        db.commit()
        msg = {
            'code' : 1,
            'msg':'修改成功',
        }
        return jsonify(msg)
@app.route('/getannotation', methods=['GET','POST'])
def get_anonotation():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        print(data)
        
        sql = "SELECT id from taskhasimgs where taskid='{taskid}' and imgid='{imgid}' " 
        sql = sql.format(taskid=data["task_id"],imgid=data["img_id"])
        cursor.execute(sql)
        tmid=cursor.fetchone()
        print(tmid[0])
        
        sql = "SELECT imgurl from  imgs where imgid='{imgid}' " 
        sql = sql.format(imgid=data["img_id"])
        cursor.execute(sql)
        imgurl=cursor.fetchone()

        sql = "SELECT * from annotations where taskimgid='%d'"%tmid[0] 
        
        cursor.execute(sql)
        allanno=cursor.fetchall()
        print(allanno)
        
        data = {
            "imgurl" : imgurl[0],
            "tmid":tmid[0],
            "allanno":allanno
        }
        return jsonify(data)

@app.route('/commitannotation', methods=['GET','POST'])
def commit_anonotation():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        print(data)
        cursor = db.cursor()
       
        print(data["tmid"])
        print(data["annos"])
        sql = "delete from annotations where taskimgid='%d'"%data["tmid"]
        cursor.execute(sql)
        db.commit()
        
        for anno in data["annos"]:
            sql = "insert into annotations values(null,'{taskimgid}','{text}','{x}','{y}','{width}','{height}','{type}')"
            sql = sql.format(taskimgid=data["tmid"],text=anno['data']['text'],x=anno['geometry']['x'],y=anno['geometry']['y'],
            width=anno['geometry']['width'],height=anno['geometry']['height'],type=anno['geometry']['type'])
            cursor.execute(sql)
            db.commit()
        data = {
            "code" : 1,
            "msg":'保存成功',
        }
        return jsonify(data)

@app.route('/create', methods=['GET','POST'])
def create_task():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        
        cursor = db.cursor()
        sql = "select * from tasks where taskname='%s'" % data["task_name"]
        
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"任务名已存在"}
        sql = "insert into tasks values(null,'{taskname}','{taskintro}','{userid}',null,null,'0','{coverid}')"
        sql = sql.format(taskname=data["task_name"],taskintro=data["taks_intro"],userid=request.headers['user_id'],coverid=data["imglist"][0])
        cursor.execute(sql)
        db.commit()
        sql = "select taskid from tasks where taskname='%s'" % data["task_name"]
        cursor.execute(sql)
        thistaskid = cursor.fetchone()
        
        for oneimgid in data["imglist"]:
            
            sql = "insert into taskhasimgs values(null,'{taskid}','{imgid}')"
            sql = sql.format(taskid=thistaskid[0],imgid=oneimgid)
            
            cursor.execute(sql)
            db.commit()
        data = {
            "code": 1,
            "msg":'创建成功'     
        }
        return jsonify(data)

    
@app.route('/output', methods=['GET','POST'])
def output():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        sql = "select * from taskhasimgs where taskid='%s'" % data["task_id"]
        cursor.execute(sql)
        allimgs=cursor.fetchall()
        for i in range(len(allimgs)):
            doc = minidom.Document() #1. 创建dom树对象
            root_node = doc.createElement("annotation")#2. 创建根结点，并用dom对象添加根结点
            doc.appendChild(root_node)
            folder_node = doc.createElement("folder")  #3. 创建结点，结点包含一个文本结点, 再将结点加入到根结点
            folder_value = doc.createTextNode('upload')
            folder_node.appendChild(folder_value)
            root_node.appendChild(folder_node)

            sql = "select * from imgs where imgid='%s'" % allimgs[i][2]
            cursor.execute(sql)
            oneimg=cursor.fetchone()

            filename_node = doc.createElement("filename")
            filename_value = doc.createTextNode(oneimg[1])
            filename_node.appendChild(filename_value)
            root_node.appendChild(filename_node)

            path_node = doc.createElement("path")
            path_value = doc.createTextNode("/upload/img"+oneimg[3])
            path_node.appendChild(path_value)
            root_node.appendChild(path_node)

            source_node = doc.createElement("source")
            database_node = doc.createElement("database")
            database_node.appendChild(doc.createTextNode("upload"))
            source_node.appendChild(database_node)
            root_node.appendChild(source_node)
            
            img = cv2.imread(basedir + "\\frontend\\public\\upload\\img\\"+oneimg[3])  #读取图片信息
            sp = img.shape #[高|宽|像素值由三种原色构成]
            
            size_node = doc.createElement("size")
            for item, value in zip(["width", "height", "depth"], [sp[1], sp[0], sp[2]]):
                elem = doc.createElement(item)
                elem.appendChild(doc.createTextNode(str(value)))
                size_node.appendChild(elem)
            root_node.appendChild(size_node)

            seg_node = doc.createElement("segmented")
            seg_node.appendChild(doc.createTextNode(str(0)))
            root_node.appendChild(seg_node)

            sql = "select * from annotations where taskimgid='%s'" % allimgs[i][0]
            cursor.execute(sql)
            allannos=cursor.fetchall()
            for j in range(len(allannos)):
                obj_node = doc.createElement("object")
                name_node = doc.createElement("name")
                name_node.appendChild(doc.createTextNode(allannos[j][2]))
                obj_node.appendChild(name_node)

                pose_node = doc.createElement("pose")
                pose_node.appendChild(doc.createTextNode("Unspecified"))
                obj_node.appendChild(pose_node)

                trun_node = doc.createElement("truncated")
                trun_node.appendChild(doc.createTextNode(str(0)))
                obj_node.appendChild(trun_node)

                trun_node = doc.createElement("difficult")
                trun_node.appendChild(doc.createTextNode(str(0)))
                obj_node.appendChild(trun_node)

                bndbox_node = doc.createElement("bndbox")
                for item, value in zip(["xmin", "ymin", "xmax", "ymax"], [allannos[j][3], allannos[j][4], allannos[j][3]+allannos[j][5], allannos[j][4]+allannos[j][6]]):
                    elem = doc.createElement(item)
                    elem.appendChild(doc.createTextNode(str(value)))
                    bndbox_node.appendChild(elem)
                obj_node.appendChild(bndbox_node)
                root_node.appendChild(obj_node)

            print(allimgs[i][0])
            url=basedir + "\\frontend\\public\\download\\"+str(allimgs[i][0])+".xml"
            with open(url, "w", encoding="utf-8") as f:
                # 4.writexml()第一个参数是目标文件对象，第二个参数是根节点的缩进格式，第三个参数是其他子节点的缩进格式，
                # 第四个参数制定了换行格式，第五个参数制定了xml内容的编码。
                doc.writexml(f, indent='', addindent='\t', newl='\n', encoding="utf-8")
    data = {
        "code": 1,
        "msg":"导出成功"
    }
    return jsonify(data)
    # 每一个结点对象（包括dom对象本身）都有输出XML内容的方法，如：toxml()--字符串, toprettyxml()--美化树形格式。
    # print(doc.toxml(encoding="utf-8"))  # 输出字符串
    # print(doc.toprettyxml(indent='', addindent='\t', newl='\n', encoding="utf-8"))   #输出带格式的字符串
    # doc.writexml() #将prettyxml字符串写入文件





if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)
