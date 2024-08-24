class UserDTO{
// Whatever we need, we are bringing it here from the DTO
//and dto use in authcontroller.js
    constructor(user){
        this._id=user._id,
        this.username=user.username,
        this.email=user.email
    }
}
module.exports=UserDTO