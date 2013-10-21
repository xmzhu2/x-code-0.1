/**
 * Created with JetBrains WebStorm.
 * User: xmzhu2
 * Date: 13-10-17
 * Time: 上午11:42
 * To change this template use File | Settings | File Templates.
 */


/**
 *  @module view
 */
(function(){

    var default_config = {
        /**
         * 组件宽度
         * @property width
         * @for X.view.Component
         * @type {Number|String}
         * @default 400
         */
        width:400,

        /**
         * 组件高度
         * @property height
         * @for X.view.Component
         * @type {Number|String}
         * @default 400
         */
        height:400,

        /**
         * 组件渲染元素的样式
         * @property style
         * @for X.view.Component
         * @type {String}
         * @default ''
         */
        style:"",

        /**
         * 组件渲染元素的class，
         * 以' ‘分割的多个class可以执行
         * @property cls
         * @for X.view.Component
         * @type {String}
         * @default ''
         */
        cls:"",

        /**
         * 组件渲染元素的id
         * @property renderTo
         * @for X.view.Component
         * @type {String|X.view.Container}
         * @default 'body'
         */
        renderTo:"body",

        /**
         * 需要渲染的html代码
         * @property html
         * @for X.view.Component
         * @type {String}
         */
        html:"",
        listeners:{},
        plugins:[],
        cId:'',
        xtype:""
    }

    /**
     * 组件基类.
     * 所有扩展的组建都是基于此类进行扩展的。
     * @class Component
     * @namespace X.view
     */
    XClass.define('X.view.Component',{

        /**
         * 是否已经渲染过了
         * @attribute __isRender
         * @private
         */
        __isRender:false,

        /**
         * 构造函数，通过new()调用
         * @class Component
         * @method init(实际上会被new的时候自己调用)
         * @constructor
         * @param config
         */
        init:function(config){
            var me = this;

            //这里必须深度拷贝一个
            var config = me.config = XUtil.applyIf(default_config,config,true);

            var listenersNameArr = me.parent.listeners;

            //调用所有插件
            XUtil.each(config.plugins,function(data,index){
                if(data.isPlugin && data.initPlugin){
                    data.initPlugin(me);
                }
            })

            //todo 持有动画类

            /**
             * 渲染模板引擎<br/>
             * 主要是针对{{#crossLink "X.view.Component/html:property"}}{{/crossLink}}属性
             * @attribute tpl
             * @type {X.template.BaseTemplate}
             */
             me.tpl = me.tpl ||  X.template.BaseTemplate.new(config.html);

            //bind事件
            XUtil.each(listenersNameArr,function(data){
                me.bind(data,config.listeners[data]||XUtil.emptyFn);
            })

            //注册到ComponentManager中

        },

        /**
         * 渲染方法<br/>
         * 只会调用一次，后面会
         * @method render
         * @param renderTo {String|X.view.Container} 指定渲染容器
         * @param data {Object|Array} 渲染数据
         * @return {this} this 用于链式操作
         */
        render:function(renderTo,data){
            var me = this,config = me.config,
                renderTo = renderTo ||config.renderTo;

            me.trigger('beforeRender',renderTo,data);

            if(me.__isRender){
                me.update(data);
                return me;
            }

            /**
             * 渲染的DOM操作元素(jquery对象)
             * @attribute el
             * @type {Jquery}
             */
            me.el = me.tpl.appendTo(renderTo,data);
            me.__isRender = true;

            me.trigger('afterRender',renderTo);
            //链式结构
            return me;
        },

        /**
         * 重新渲染,更新数据
         * @method update
         * @param data
         */
        update:function(data){
            var me = this;
            me.tpl.update(me.el,data);
        }

    },{
        interfaces:['X.Observer'],
        listeners:[
            /**
             * 渲染前执行
             * @event beforeRender
             * @param {X.view.Container|String} renderTo
             * @param {Object|Array} data
             */
            'beforeRender',

            /**
             * 渲染后执行
             * @event afterRender
             * @param {X.view.Container|String} renderTo
             */
            'afterRender'
        ]
    })

}).call(this)
