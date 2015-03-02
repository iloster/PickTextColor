var MainLayer = cc.LayerColor.extend({
	init:function()
	{
		//初始化界面
		 //0:点击开始界面 1:表示等待界面，2:表示在点击界面 3:结果界面 4:Too soon界面
		this.flag = 0;
		this._super();
		this.size = cc.Director.getInstance().getWinSize();
		this.setColor(cc.c4(180,170,160,255));
		this.showToStart();
		
		//可触摸
		this.setTouchEnabled(true);

		this.redColor = new Array(255, 0, 0);
		this.yellowColor = new Array(255, 255, 0);
		this.greenColor = new Array(0, 255, 0);
		this.blueColor = new Array(0, 0, 255 );
		this.purpleColor = new Array(139, 0, 255);
		this.blackColor = new Array(0,0,0);

		this.allColor = new Array(this.redColor,this.yellowColor,this.greenColor,this.blueColor,this.purpleColor,this.blackColor);
		this.allColorText = new Array("红色","黄色","绿色","蓝色","紫色","黑色");
	},

	/////////////////////////////////////////////////
	//处理触摸事件
	/////////////////////////////////////////////////
	onTouchesEnded:function(touches,event)
	{

	},
	onTouchesBegan:function(touches,event)
	{
		cc.log("onTouchsBegan",this.flag);
		switch(this.flag)
		{
			case 0:this.showGame();break;
			//case 1:this.showToSoon();break;
			case 2:this.showToStart();break;
		}

	},
	//显示点击开始界面
	showToStart:function()
	{
		this.sprite = cc.Sprite.create(s_ClickToStart);
		this.sprite.setPosition(this.size.width/2,this.size.height/2);
		this.addChild(this.sprite,1);
		//click to start 动画
		this.startAnim = cc.Sprite.create(s_ClickToStartAnim);
		this.startAnim.setPosition(this.size.width/2,this.size.height/2);
		this.addChild(this.startAnim,1);
		var action = cc.Sequence.create(cc.FadeOut.create(1.0),cc.FadeIn.create(1.0));
		var rep = cc.RepeatForever.create(action);
		this.startAnim.runAction(rep);

		this.flag = 0;
		
	},
	//显示游戏界面
	showGame:function()
	{
		//显示背景
		 // this.sprite = cc.Sprite.create(s_Background);
		 // this.sprite.setPosition(this.size.width/2,this.size.height/2);
		 this.setTouchEnabled(false);
		 this.startDate = new Date();
		 var randomNum1 = Math.floor(Math.random()*6);
		 var randomNum2 = Math.floor(Math.random()*6);
		 while(randomNum1 == randomNum2)
		 {
		 	randomNum2 = Math.floor(Math.random()*6);
		 }
		 this.removeAllChildren();
		//显示一个文字
		this.textLabel = cc.LabelTTF.create(this.allColorText[randomNum2],"微软雅黑",50);
		this.textLabel.setColor(cc.c3(this.allColor[randomNum1][0], this.allColor[randomNum1][1], this.allColor[randomNum1][2]));
		this.textLabel.setPosition(this.size.width/2,this.size.height*2/3);
		this.addChild(this.textLabel,2);

		//显示底部按钮
		var randomNum3 = Math.floor(Math.random()*10)%2;
		var tmp1 = 1;
		var tmp2 = 2;
		if(randomNum3 == 0)
		{
			tmp1 = 1;
			tmp2 = 2;
		}else
		{
			tmp1 = 2;
			tmp2 = 1;
		}
		cc.log("randomNum3",randomNum3);		
		var rightBtn = cc.MenuItemImage.create(
            "res/btn.png",
            "res/btn.png",
            function () {          	
                this.showResult(1);
            },this);
		rightBtn.setColor(cc.c3(this.allColor[randomNum1][0], this.allColor[randomNum1][1], this.allColor[randomNum1][2]));
        rightBtn.setAnchorPoint(0.5, 0.5);
        rightBtn.setPosition(this.size.width*tmp1/3,this.size.height/3);

        var errorBtn = cc.MenuItemImage.create(
            "res/btn.png",
            "res/btn.png",
            function () {               
               this.showResult(0);
            },this);
        errorBtn.setAnchorPoint(0.5, 0.5);
        errorBtn.setColor(cc.c3(this.allColor[randomNum2][0], this.allColor[randomNum2][1], this.allColor[randomNum2][2]));
        errorBtn.setPosition(this.size.width*tmp2/3,this.size.height/3);
        var menu = cc.Menu.create(rightBtn,errorBtn);

        menu.setPosition(0,0);
        this.addChild(menu, 1);
      
		this.flag = 1;
	},

	showResult:function(tag)
	{
		this.setTouchEnabled(true);
		this.removeAllChildren();
		var str;
		
		
		this.endDate = new Date();//记录点击时间
		time = this.endDate.getTime() - this.startDate.getTime();
		this.sprite = cc.Sprite.create(s_Result);
		this.sprite.setPosition(this.size.width/2,this.size.height/2);
		this.addChild(this.sprite,1);
		if(tag == 1)
		{
			str = time+"ms";
		}else
		{
			str = "ERROR!";
		}

		cc.log("showResult",time);
		this.timeLabel = cc.LabelTTF.create(str,"Arial",70);
		this.timeLabel.setColor(255,255,255);
		this.timeLabel.setPosition(this.size.width/2,this.size.height/2)
		this.addChild(this.timeLabel,1);

		this.resultAnim = cc.Sprite.create(s_ResultAnim);
		this.resultAnim.setPosition(this.size.width/2,this.size.height/2-200);
		this.addChild(this.resultAnim,1);
		var action = cc.Sequence.create(cc.FadeOut.create(1.0),cc.FadeIn.create(1.0));
		var rep = cc.RepeatForever.create(action);
		this.resultAnim.runAction(rep);

		document.title = window.wxData.desc = "我的反应速度是"+time+"ms!来试试你的吧！";
		this.flag = 2;
	}

});

///////////////////////////////////////////////////
var MainScene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new MainLayer();
		layer.init()
		this.addChild(layer);
	}
});