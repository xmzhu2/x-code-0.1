/**
 * Created with JetBrains WebStorm.
 * User: xmzhu2
 * Date: 13-10-16
 * Time: 下午1:58
 */


(function(){

    var X = this.X || {};

    var root = this;
    /**
     * 命名空间管理类
     * @class NameSpaceManage
     * @private
     * @namespace X
     * @moudel base
     * @type {Object}
     */
    var NameSpaceManager = X.Class.define('X.NameSpaceManager',{

        /**
         * 命名空间快速定位
         * @attribute _namespaceList
         * @private
         */
        _namespaceList :{},

        /**
         * 创建命名空间
         * @method createNameSpace
         * @param spacename {String} 命名空间名称
         * @return {}
         */
        createNameSpace:function(spacename){
            var s = spacename.split(".");
            var r = root;
            for(var i = 0; i < s.length ; i ++){
                var x = s[i].trim();
                r = r[s[i]] || (r[s[i]] = {});
            }
            this._namespaceList[spacename] = r;
            return r;
        },

        /**
         * 查找已经缓存的命名空间，通过flag参数设置查找不到是否自动创建。
         * @method findNameSpace
         * @param spacename {String} 命名空间名称
         * @param flag  是否自动创建，默认为false
         * @return {*}
         */
        findNameSpace:function(spacename,flag){
            return (this._namespaceList[spacename]) || (flag && this.createNameSpace(spacename));
        },
        /**
         * 通过class名称得到Name
         * @method 分析className得到命名空间信息和 class名称
         * @param className
         * @return {Object}
         */
        analyzeNameSpace:function(className){
            var s = className.split(".");
            var clz = s.pop();
            return {
                namespace:s.join('.'),
                clazz:clz
            };
        },
        /**
         * 注册class到指定的命名空间
         * @param className
         * @param clazz
         */
        register:function(className,clazz){
            var ns_clz = this.analyzeNameSpace(className),
                clazzName = ns_clz.clazz,
                namespace = ns_clz.namespace;
            var ns = this.findNameSpace(namespace,true);
            ns[clazzName] = clazz;
        }
    });
    /**
     * 命名空间管理类实例()
     * @for X
     * @attribute NameSpaceManage
     * @type {NameSpaceManage}
     */
    X.NameSpaceManager = NameSpaceManager.new();

    this.X = X;
}).call(this)