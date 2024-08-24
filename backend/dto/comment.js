class CommentDTO{
    constructor(comment){
        this._id=comment._id,
        this.content=comment.content,
        this.createAt=comment.createAt,
        this.authorUsername=comment.author.username
    }
}
module.exports=CommentDTO