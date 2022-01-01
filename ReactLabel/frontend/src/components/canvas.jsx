import React, {Component} from 'react';
import { Button, Modal, Menu, Dropdown, Form, Row, Col, Input, Radio } from 'antd';


class WorkstationConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
			visible: false,
			canvas: {
            	width: 0,
				height: 0
			},
			text: 'text',
			font: '',
			selectKey: '',
			cursor: 'default'
        };

        this.canvas = null;
        this.ctx = null;
        this.clientRect = null; //保存canvas距离浏览器上下左右边距
		this.nodeArray = {}; //所有未初始渲染前所有节点数据
        this.dataNode = {}; //保存渲染后的所有实际节点数据
		this.selectNodeId = ''; //当前选中节点ID
		this.selectNode = {}; //当前选中节点
		this.dragging = false; //是否选中节点,
		this.workstationSpace = 3; //座位的左右间距
		this.seatR = 7; //座位圆半径
		this.dragHoldX = null;
		this.dragHoldY = null;
		this.clientX = null; //鼠标右击的X坐标
		this.clientY = null; //鼠标右击的Y坐标
    }

    componentDidMount() {
        this.init();
    }

    //页面初始化
    init = () =>{
		//设置canvas宽 高
		let workstationConfig = this.workstationConfig;
		!this.canvas && (this.canvas = this.workstationCanvas); //获取canvas对象
		this.clientRect = this.workstationCanvas.getBoundingClientRect(); //canvas距离浏览器上下左右边距
		!this.ctx && (this.ctx = this.canvas.getContext("2d")); //获取画布对象
		this.setState({
			canvas: {
				width: workstationConfig.clientWidth - 20,
				height: workstationConfig.clientHeight - 20
			}
		});
		window.addEventListener('mouseup', this.mouseUpListener);
	};

    //选择添加菜单
	menuClick = ({ key }) => {
		this.setState({
			visible: true,
			selectKey: key
		});
	};

	/**
	 * 获取鼠标右击时的坐标
	 * @param evt
	 * @returns {boolean}
	 */
	canvasContextMenu = ( evt ) => {
		this.clientX = evt.clientX;
		this.clientY = evt.clientY;
		return false;
	};

	/**
	 * 获取UUID
	 * @param pKey
	 * @returns {string}
	 */
	getUUID =  ( pKey ) => {
		let uid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g,function(c){
			let r=Math.random()*16|0,v=c=='x' ? r:(r&0x3|0x8);
			return v.toString(16).toLocaleUpperCase();
		});
		if( (pKey && this.dataNode[pKey + "_" + uid]) || this.nodeArray[uid] ){
			console.log("--- uid存在，重新生成 ---");
			this.getUUID();
		}
		return uid;
	};

	/**
	 * 获取鼠标在canvas上位置
	 */
	mouseSite = () =>{
		let mouseX = this.clientX - this.clientRect.left,
			mouseY = this.clientY - this.clientRect.top;
		return {
			mouseX: mouseX,
			mouseY: mouseY
		}
	};

	/**
	 * 绘制数据节点
	 */
	drawScreen = () =>{
		//清除画布
		this.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		//在canvas上渲染节点
		for(let key in this.nodeArray){
			if(this.nodeArray.hasOwnProperty(key)){
				let item = this.nodeArray[key];
				this[item['type'] + 'Draw'](item);
			}
		}
	};

	/**
	 * 绘制房间节点
	 * @param data
	 */
	roomDraw = ( data ) => {
		let pKey = data['key'];
		if(!data['textX'] || !data['textY']){
			data = this.calculateCoord(data);
		}
		data['pKey'] = pKey;
		this.dataNode[pKey + "_" + pKey] = data;
		!data['text'] && (data['text'] = '房间号');
		this.drawBase( data );
	};

	/**
	 * 绘制工位节点
	 * @param data
	 */
	workstationDraw = ( data ) => {
		!data['text'] && (data['text'] = '座位号');
		if(!data['textX'] || !data['textY']){
			data = this.calculateCoord(data);
		}
		let seat = data['seat'] || 1, //每排座位数
			row = data['row'] || 1, // 单双排
			pKey = data['key'];

		for(let j = 0;j < row;j++){ //计算单双排
			let item = {...data},
				y = data['y'],
				seatData = {}, //座位圆坐标
				width = data['width'],
				height = data['height'];
			y = height * j + y + (j * this.workstationSpace); //计算每排座位的 Y 坐标
			item['y'] = y;
			if((row == 2  && j == 0) || (row == 1 && data['direction'] == 'top')){
				seatData['y'] = y - this.seatR - 5;
			}else if( row == 2 && j == 1  || (row == 1 && data['direction'] == 'bottom')){
				seatData['y'] = +height + y + this.seatR + 5;
			}else{
				throw "参数错误: row = " + row;
			}
			for(let i = 0;i < seat;i++){ //计算座位数
				let x = data['x'], key = this.getUUID( pKey );
				x = width * i + x + (i * this.workstationSpace); //计算每个座位的 X 坐标
				item['x'] = x;
				item['pKey'] = pKey;
				item['key'] = key;
				this.dataNode[pKey + "_" + key] = item;
				this.drawBase( item );
				seatData['x'] = width / 2 + x;
				this.drawSeat(seatData);
			}
		}
	};

	/**
	 * 绘制座位
	 * @param data
	 */
	drawSeat = ( data ) =>{
		this.ctx.beginPath();
		this.ctx.arc(data['x'], data['y'], this.seatR, 0, 2*Math.PI);
		this.ctx.stroke();
	};

	/**
	 * 绘制节点基础方法
	 * @param data
	 */
	drawBase = ( data ) =>{
		this.ctx.fillStyle = '#000000';
		this.ctx.strokeRect(data['x'], data['y'], data.width, data.height);
		this.ctx.font = data['font'];
		this.ctx.fillText(data['text'], +data['x'] + +data['textX'], +data['y'] + +data['textY'] - 3);
	};

	/**
	 * 计算文字在节点中的居中位置
	 * @param data
	 * @returns {*}
	 */
	calculateCoord = ( data ) =>{
		//计算文本在节点中的相对位置(居中位置)
		//计算文本居中位置后，缓存坐标，避免重复计算导致浏览器重复重拍，影响性能
		if(this.textRef){
			let textWidthH = this.textRef.getBoundingClientRect();
			data['textX'] = ((data.width - textWidthH['width']) / 2).toFixed(2);
			data['textY'] = (+textWidthH['height'] + ((data.height - textWidthH['height']) / 2)).toFixed(2);
		}
		return data;
	};

	/**
	 * 判断是否选中节点对象
	 * @param shape
	 * @param mx
	 * @param my
	 * @returns {boolean}
	 */
	hitTest = () => {
		let mouseSite = this.mouseSite();
		for (let key in this.nodeArray) {
			if( this.nodeArray.hasOwnProperty(key)) {
				let shape =  this.nodeArray[key];
				//判断点击的节点
				if (mouseSite.mouseX > shape.x && mouseSite.mouseX < (shape.x + +shape.width) && mouseSite.mouseY > shape.y && mouseSite.mouseY < (shape.y + +shape.height)) {
					this.dragging = true;
					//判断鼠标是否保持在节点上
					this.dragHoldX = mouseSite.mouseX - shape.x;
					this.dragHoldY = mouseSite.mouseY - shape.y;
					return key;
				}
			}
		}
		return false;
	};

	/**
	 * 鼠标按下事件
	 * @param evt
	 */
	canvasMouseDown = ( evt ) => {
		if(evt.ctrlKey){
			this.clientX = evt['clientX'];
			this.clientY = evt['clientY'];
			if( this.selectNodeId = this.hitTest() ){
				this.selectNode = this.nodeArray[this.selectNodeId];
				this.setState({
					cursor: 'move'
				});
			}
		}
	};

	/**
	 * 鼠标释放事件
	 * @param evt
	 */
	mouseUpListener = (evt) => {
		if (this.dragging) {
			this.dragging = false;
			this.setState({
				cursor: 'default'
			});
		}
		return false;
	};

	/**
	 * 鼠标移动事件
	 * @param evt
	 */
	mouseMoveListener = (evt) => {
		if(this.dragging && evt.ctrlKey){
			this.clientX = evt['clientX'];
			this.clientY = evt['clientY'];
			let posX, posY, minX = 0,
				maxX = this.state.canvas.width - this.selectNode.width,
				minY = 0,
				maxY = this.state.canvas.height - this.selectNode.height,
				mouseSite = this.mouseSite();//获取鼠标点击坐标
			//防止拖动到画布外面
			posX = mouseSite.mouseX - this.dragHoldX;
			posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
			posY = mouseSite.mouseY - this.dragHoldY;
			posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
			this.nodeArray[this.selectNodeId].x = posX;
			this.nodeArray[this.selectNodeId].y = posY;
			this.drawScreen();
		}else{
			this.dragging = false;
			this.setState({
				cursor: 'default'
			});
		}
		return false;
	};


	handleOk = e => {
		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				let key = this.getUUID(),
					mouseSite = this.mouseSite(),
					x = mouseSite.mouseX - fieldsValue['width'] / 2,
					y = mouseSite.mouseY - fieldsValue['height'] / 2;
				fieldsValue['fontSize'] = fieldsValue['fontSize'] || (this.state.selectKey == 'room' ? 16 : 12);
				fieldsValue['font'] = fieldsValue['fontSize'] + "px Arial";
				this.nodeArray[key] = {...{
						type: this.state.selectKey,
						key: key,
						x: x,
						y: y
					}, ...fieldsValue};

				this.setState({
					text: fieldsValue['text'] || (this.state.selectKey == 'room' ? "房间号" : "座位号"),
					font: fieldsValue['font']
				}, () => {
					this.drawScreen();
					this.setState({
						visible: false
					});
				});
			}
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false
		});
	};

	render() {
		const menu = (
			<Menu onClick={this.menuClick}>
				<Menu.Item key="workstation">添加工位</Menu.Item>
				<Menu.Item key="room">添加房间</Menu.Item>
			</Menu>
		);

		let { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 }
			}
		};

		let style = {color: '#ffffff'};
		this.state.font && (style['font'] = this.state.font);
        return (
			<div className={'workstation-config'} onContextMenu={(e) => this.canvasContextMenu(e)} ref={ref => this.workstationConfig = ref} selectstart="return false;">
				<Dropdown overlay={menu} trigger={['contextMenu']}>
					<canvas
						onMouseDown={e => this.canvasMouseDown(e)}
						onMouseMove={e => this.mouseMoveListener(e)}
						width={this.state.canvas.width}
						height={this.state.canvas.height}
						ref={ref => (this.workstationCanvas = ref)}
						className={'workstation-canvas'}
						style={{cursor: this.state.cursor}}
					></canvas>
				</Dropdown>
				<Modal
					title="参数配置"
					maskClosable={false}
					destroyOnClose={true}
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					{this.state.selectKey == 'workstation' && <Form {...formItemLayout}>
						<Row span={24} gutter={24}>
							<Col span={12}>
								<Form.Item label="座位数">
									{getFieldDecorator('seat', { initialValue: 3 })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="字体大小">
									{getFieldDecorator('fontSize', { initialValue: 12 })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row span={24} gutter={24}>
							<Col span={12}>
								<Form.Item label="宽" >
									{getFieldDecorator('width', { initialValue: 40 })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="高" >
									{getFieldDecorator('height', { initialValue: 25 })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row span={24} gutter={24}>
							<Col span={12}>
								<Form.Item label="方向" >
									{getFieldDecorator('position', { initialValue: 1 })(
										<Radio.Group  value={1}>
											<Radio value={1}>横</Radio>
											<Radio value={2}>竖</Radio>
										</Radio.Group>
									)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="单双排" >
									{getFieldDecorator('row', { initialValue: 2 })(
										<Radio.Group value={1}>
											<Radio value={1}>单排</Radio>
											<Radio value={2}>双排</Radio>
										</Radio.Group>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col>
								<label style={style} ref={ref => this.textRef = ref}>{this.state.text}</label>
							</Col>
						</Row>
					</Form>}
					{this.state.selectKey == 'room' && <Form {...formItemLayout}>
						<Row span={24} gutter={24}>
							<Col span={12}>
								<Form.Item label="房间号">
									{getFieldDecorator('text', { initialValue: '房间号' })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="字体大小">
									{getFieldDecorator('fontSize', { initialValue: 16 })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row span={24} gutter={24}>
							<Col span={12}>
								<Form.Item label="宽" >
									{getFieldDecorator('width', { initialValue: 150 })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="高" >
									{getFieldDecorator('height', { initialValue: 50 })(
										<Input type="text" />
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col>
								<label style={style} ref={ref => this.textRef = ref}>{this.state.text}</label>
							</Col>
						</Row>
					</Form>}
				</Modal>
			</div>
        );
    }
}
export default WorkstationConfig;

