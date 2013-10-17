/**
 * Created with JetBrains WebStorm.
 * User: rongwang
 * Date: 13-10-16
 * Time: 下午1:58
 * To change this template use File | Settings | File Templates.
 */


/**
 * 基础模板渲染类，用于渲染模板，提供将json,object,array类型数据
 * 根据设定好的模板渲染成html<br/>
 *
 * 渲染数据以{}包括就可以了。其中可以是对象x.a.b形式 也可以是{0}，{1}形式
 *
 * @Class BaseTemplate
 * @namespace X.template
 * @module base
 */
XClass.define('X.template.BaseTemplate',{

    /**
     * 初始化构造方法
     * @method init
     * @constructor
     * @param template {String}
     */
    init:function(template){
        if(X.Util.isArray(template)){
            template = template.join('');
        }
        this.template = template;
    },

    /**
     * 生成html并且渲染到指定dom元素<br/>
     * 渲染的目标可以是html的dom元素、jquery对象、元素ID、XDom(尚未实现)；<br/>
     * dreturnFlag是标识返回对象的类型“dom”(默认),"jquery","x"
     * @method append
     * @param render {HTMLDOM|Jquery|String|XDOM} 渲染目标
     * @param data {Object|Array} 需要展示的数据
     * @param returnFlag {String|Number} 返回对象的类型
     */
    append:function(render,data,returnFlag){
        var html = this.apply(data);
        render = this.__getRender(render);
        render.append(html);
        return (returnFlag =='jquery')?render:render[0];
    },


    __getRender:function(render){
        if(typeof render =='string'){
            render = "#"+render;
        }
        render = $(render);
        return render;
    },

    /**
     * 将数据转化成html
     * @method apply
     * @param data {Object|Array}数据
     * @return {*}
     */
    apply:function(data){
        if(!data){
            return false;
        }

        var t = this.template,html = t;
        flag  = XUtil.isArray(data);

        html = html.replace(/{(\w+.?)*}/g,function(text){
            text = text.substring(1,text.length -1);
            if(flag){
                return data[text];
            }else{
                var p = text.split('.');
                var d = data;
                for(var i =0 ; i<p.length ; i++){
                    if(p[i].trim() == '') break;
                    d = d[p[i]]
                }
                return d;
            }
        })

        return html;
    }

},{

})