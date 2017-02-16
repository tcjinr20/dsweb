/**
 * Created by Administrator on 2016/12/23.
 */
//游戏角色信息
function copy(obj){
    if(obj){
        for(var s in this){
            this[s]=obj[s]||this[s];
        }
    }
}
module.exports.GamePerson= function () {
    this.userid=0;//用户id
    this.gameid = 1;
    this.body = 1;//角色素材
    this.head = 1;
    this.sex = 1;
    this.age = 1;
    this.pos= 1;//角色位置
    this.weight = 1;//体重
    this.height = 1;//身高
    this.zhai = 1;
}
//游戏信息
module.exports.GameVO= function(obj) {
    this.img = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkxLjUiIHk9IjEwMCIgc3R5bGU9ImZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMXB0O2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjI0MngyMDA8L3RleHQ+PC9nPjwvc3ZnPg==";
    this.gamedes = "";
    this.gamename = '';
    this.userid=1;
    this.path='';
    this.mainscript ="main.js";
    this.mainhtml = "index.html";
    copy.call(this,obj);
}


module.exports.ArticleVO = function (obj) {
    this.title = "";
    this.content = '';
    this.addtime = new Date().getTime();
    this.attament='';//附件
    this.cate ='default';//分类
    this.label=[];//标签
    this.author='';//作者
    if(obj.label){
        obj.label = obj.label.split(',');
    }
    for(var s in this){
        this[s]= obj[s]||this[s];
    }
}

module.exports.LabelVO = function (obj) {
    this.name = "";
    this.des = '';
    this.act=''
    this.addtime = new Date().getTime();
    this.author='';//作者
    for(var s in this){
        this[s]= obj[s]||this[s];
    }
}