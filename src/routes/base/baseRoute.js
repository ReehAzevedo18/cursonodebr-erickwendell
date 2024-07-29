class BaseRoute {
    static methods(){
        //Os membros da classe this.prototype
        return Object.getOwnPropertyNames(this.prototype).filter(method => method !== 'constructor'
            && !method.startsWith('_'))
    }
}
module.exports = BaseRoute