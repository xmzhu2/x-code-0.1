/**
 * Created with JetBrains WebStorm.
 * User: xmzhu2
 * Date: 13-10-16
 * Time: 下午12:58
 */


(function(){

    var X = this.X || {};

    /**
     * <h3>事件</h3><br>
     *     这是一个提供继承的对象。本身不继承于X.Class;<br/>
     *     提供绑定事件，触发事件，解除事件绑定功能
     * @namespace X
     * @module base
     * @class Observer
     * @type {Object}
     */
    X.Observer = {

        /**
         * 绑定事件<br/>
         * 提供绑定事件,默认事件名称以逗号分割
         * @method bind
         * @param ev {String} 事件名称
         * @param callback  事件响应方法
         * @param splitNode 事件分割符号（默认','，我知道很多人呢喜欢用空格）
         * @return {Observer} this
         */
        bind: function(ev, callback,splitNode) {
            var splitNode_ = splitNode || ",";
            var evs   = ev.split(splitNode_);
            var calls = (this.hasOwnProperty("_callbacks") && this._callbacks) ||
                (this._callbacks = {});

            for (var i=0; i < evs.length; i++)
                (calls[evs[i]] || (calls[evs[i]] = [])).push(callback);

            return this;
        },

        /**
         * 触发事件<br/>
         * 如果成功触发返回true
         * @example
         *     A.trigger('click',1,2,3);<br>
         *     会触发A的click事件，并会讲1，2，3作为参数传递给click，并且会以A为click执行的上下文
         * @param evName {String...}
         * @return {Boolean}
         */
        trigger: function() {
            var args = makeArgArray(arguments);
            var ev   = args.shift();

            var list, calls, i, l;
            if (!(calls = this.hasOwnProperty("_callbacks") && this._callbacks)) return false;
            if (!(list  = this._callbacks[ev])) return false;

            for (i = 0, l = list.length; i < l; i++)
                if (list[i].apply(this, args) === false)
                    return false;

            return true;
        },

        /**
         * 解除事件绑定<br/>
         * 如果调用A.unbind()，你将会清空a对象所有的事件，很神奇哦；<br/>
         * 如果存在callback的话 ，不会清空事件所有方法，而只会清空事件中相同的方法
         * @method unbind
         * @param ev 事件名称
         * @param callback 删除事件绑定的具体方法
         * @return {*}
         */
        unbind: function(ev, callback){
            if ( !ev ) {
                this._callbacks = {};
                return this;
            }

            var list, calls, i, l;
            if (!(calls = this._callbacks)) return this;
            if (!(list  = calls[ev])) return this;

            if ( !callback ) {
                delete this._callbacks[ev];
                return this;
            }

            for (i = 0, l = list.length; i < l; i++)
                if (callback === list[i]) {
                    list = list.slice();
                    list.splice(i, 1);
                    calls[ev] = list;
                    break;
                }

            return this;
        }
    };


    this.X = X;
}).call(this)
