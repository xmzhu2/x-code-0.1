/**
 * Created with JetBrains WebStorm.
 * User: xmzhu2
 * Date: 13-10-16
 * Time: 下午12:58
 */


(function(){

    var version = '0.0.1';
    var defaultClass = ["X.NameSpaceManager"].join(",");
    /**
     * 基础类的全局命名空间
     * @class X
     * @main
     * @type {Object}
     */
    var X = {};

    /**
     * 通用工具类
     * @class Util
     * @namespace X
     * @type {Object}
     */
    X.Util = {};

    /**
     * 版本号
     * @for X
     * @attribute version
     * @type {String}
     */
    X.version = version;

    //为object所有对象添加create方法
    if (typeof Object.create !== "function")
        Object.create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
    };

    /**
     * 深度拷贝
     * @method clone
     * @for X.Util
     * @param item
     * @return {*}
     */
    X.Util.clone = function(item){

        var type,i,j,k,clone,key;

        if (item === null || item === undefined) {
            return item;
        }

        type = toString.call(item);

        // Date
        if (type === '[object Date]') {
            return new Date(item.getTime());
        }
        // Array
        if (type === '[object Array]') {
            i = item.length;
            clone = [];
            while (i--) {
                clone[i] = X.Util.clone(item[i]);
            }
        }
        // Object
        else if (type === '[object Object]' && item.constructor === Object) {
            clone = {};
            for (key in item) {
                clone[key] = X.Util.clone(item[key]);
            }
        }

        return clone || item;
    }


    /**
     * 数据整合<br/>
     * 将obj2的数据拷贝到obj1,如果cloneFlag为ture，则会深度拷贝一个对象。不会修改obj1
     * @method applyIf
     * @for X.Util
     * @param {Object} obj1
     * @param {Object} obj2
     * @param {Boolean} cloneFlag
     */
    X.Util.applyIf = function(obj1,obj2,cloneFlag){

        if(cloneFlag){
            obj1 = X.Util.clone(obj1);
        }

        for(var x in obj2){
            if(obj2.hasOwnProperty(x)){
                obj1[x] = obj2[x];
            }
        }

        return obj1;
    }

    /**
     * 判断是否是数组
     * @for Util
     * @method isArray
     * @param isArrayItem {Object}
     * @return {Boolean}
     */
    var isArray = X.Util.isArray = function (isArrayItem) {
        return Object.prototype.toString.call(isArrayItem) === "[object Array]";
    };

    /**
     * 转换成为数组
     * @for Util
     * @method makeArgArray
     * @param args {Object}
     * @return {Array}
     */
    var makeArgArray = X.Util.makeArgArray = function (args) {
        return Array.prototype.slice.call(args, 0);
    };

    /**
     * 查找数组对应值<br/>
     * 如果没有则返回-1
     * @for Util
     * @method findIndex
     * @param array {Array}
     * @param value {String|Object}
     * @return {Number} 位置
     */
    var findIndex = X.Util.findIndex = function (array, value) {
        for (var i = 0; i < array.length; i++)
            if (array[ i ] === value)
                return i;
        return -1;
    };

    /**
     * each调用<br/>
     * 简单版本 目前只支持array
     * @method each
     * @param arr {Object|Array}
     * @param callback {Function} 执行方法|function(data,index){}
     */
    X.Util.each = function(arr,callback){

        if(isArray(arr)){
            for(var i = 0 ; i < arr.length ; i++){
                if(callback){
                    callback(arr[i],i);
                }
            }
        }
    }

    /**
     * 空函数
     * @for X.Util
     * @attribute emptyFn
     * @type {Function}
     */
    X.Util.emptyFn = function(){};

    var moduleKeywords = ["included", "extended"];

    //  init 是构造函数可以重写
    //  initialize 是构造初始化，可被子类初始化的时候进行执行，如果2个归并则会造成递归死循环
    /**
     * 类对象<br/>
     * 实现oo接口，所有构建对象的父对象<br/>
     * 可以实现多继承（不推荐。容易逻辑混乱）<br/>
     *  <h4>如何创建一个类？</h4>
     *  你只需要通过 var A = X.Class.define({x:1});就可以创建一个简单的类 A 。<br/>
     *  也可以通过  var A = X.Class.define();A.include({x:1});定义一个相同的类 A<br/>
     *  <h4>如何继承一个类</h4>
     *  include 用来继承一个类的实例部分;<br>
     *  extend 用来继承一个类的静态部分
     * @class Class
     * @module base
     * @namespace X
     *
     */
    var Class = X.Class = {


        /**
         * 类名称
         * @attribute $X_ClassName
         * @private
         */
        $X_ClassName:"X.Class",

        /**
         * 类创建完成后，执行方法
         * @method inherited
         */
        inherited:function(){},

        /**
         * 创建类完成后执行的方法<br/>
         *
         * @method created
         * @defalut Empty Function
         */
        created:function(){},

        /**
         * @attribute prototype
         */
        prototype: {
            initialize: function(){},
            init: function(){}
        },
        /**
         * 定义类
         * <br/>
         * extend 存在默认属性interfaces,允许多接口
         * @method define
         * @static
         * @param className {String} 类名称（可以带上命名空间）
         * @param include {Object}实例的方法和属性
         * @param extend {Object}  静态的方法和属性
         * @return {Object} 定义的类对象
         * @example
         *  <p>var A = X.Class.define({
         *                      hello:function(a){
         *                              alert(a)
         *                            }
         *                       },{HelloWolrd:'123'});
         *  </p>
         *  那么就会定义出来一个类 A
         */
        define: function(className,include, extend){

            var object = Object.create(this);
            object.parent    = this;
            object.prototype = object.fn = Object.create(this.prototype);
            object.$X_ClassName = className;
            object.$X_ParentClassName = this.$X_ClassName;


            if (include) object.include(include);
            if (extend)  object.extend(extend);

            object.created();
            this.inherited(object);

            //如果存在interface集成interface
            if(object.interfaces && isArray(object.interfaces)){
                for(var i = 0; i < object.interfaces.length ; i ++){
                    var interface = object.interfaces[i];
                    if(typeof interface =='String' || typeof interface =='string'){
                        var nsA = X.NameSpaceManager.analyzeNameSpace(interface);
                        var ns = X.NameSpaceManager.findNameSpace(nsA.namespace);
                        if(ns){
                            interface = ns[nsA.clazz];
                        }else{
                            interface = {};
                        }
                    }
                    object.include(interface);
                }
            }
            if(defaultClass.indexOf(className) == -1){
                X.NameSpaceManager.register(className,object);
            }
            return object;
        },
        //TODO  需要一个动态通过class名称new出对象的方法

        //这里需要实现继承能够优先执行super（）；
        /**
         * 生产实例<br>
         * <h5>生产过程!</h5>
         * 1.创建生产实例对象.<br/>
         * 2.实例对象默认添加属性parent 指向当前对象（类）。<br/>
         * 3.实例持有父类的init方法(_super).<br/>
         * 4.实例对象执行初始化方法initialize（复写这个方法就会在创建时执行）.<br/>
         * 5.调用实例的init方法.<br/>
         * @method new
         * @static
         * @return {*}
         */
        new: function(){
            var instance = Object.create(this.prototype);
            instance.parent = this;
            instance._super = this.new;

            instance.getClassName = function(){
                return this.parent.$X_ClassName;
            }

            instance.initialize.apply(instance, arguments);
            instance.init.apply(instance, arguments);
            return instance;
        },

        /**
         * 代理<br>
         * 将方法的执行上下文切换到当前对象
         * @method proxy
         * @param func {Function}
         * @return {Function}
         */
        proxy: function(func){
            var thisObject = this;
            return(function(){
                return func.apply(thisObject, arguments);
            });
        },

        /**
         * 全部代理<br/>
         * 将参数中所有方法全部在当前对象作为context执行
         * @method proxyAll
         * @param {Array}
         */
        proxyAll: function(){
            var functions = makeArgArray(arguments);
            for (var i=0; i < functions.length; i++)
                this[functions[i]] = this.proxy(this[functions[i]]);
        },

        /**
         * 扩展实例<br/>
         * 允许对对象的实例进行扩展，并且会影响类已经生成的实例;<br/>
         * 可以通过 参数对象obj 如果存在 included，则扩展成功会自动执行（以当前对象为执行上下文）
         * @method include
         * @static
         * @param obj 扩展实例属性
         * @return {*}
         */
        include: function(obj){
            for(var key in obj)
                if (findIndex(moduleKeywords,key) === -1)
                    this.fn[key] = obj[key];

            var included = obj.included;
            if (included) included.apply(this);
            return this;
        },

        /**
         * 静态属性扩展<br/>
         * 可以通过 参数对象obj 如果存在 extended，则扩展成功会自动执行（以当前对象为执行上下文）
         * @method extend
         * @static
         * @param obj 类静态属性扩展对象
         * @return {*}
         */
        extend: function(obj){
            for(var key in obj)
                if (findIndex(moduleKeywords,key) === -1)
                    this[key] = obj[key];

            var extended = obj.extended;
            if (extended) extended.apply(this);
            return this;
        }
    }
    Class.prototype.proxy    = Class.proxy;
    Class.prototype.proxiyAll = Class.proxyAll;
    Class.inst               = Class.init;
    Class.sub                = Class.define;

    this.X = X;
    this.XClass = X.Class;
    this.XUtil = X.Util;
}).call(this)