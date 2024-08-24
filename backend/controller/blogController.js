const Joi =require("joi")
const fs =require("fs")
const Blog =require("../models/blog")
const {BACKEND_SERVER_PATH, CLOUD_NAME, API_KEY, API_SECRET}=require("../config/index")
const BlogDTO=require("../dto/blog")
const BlogDetailsDTO=require("../dto/blog-details");
const Comment=require("../models/comment")
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const cloudinary=require("cloudinary").v2;

 // Configuration
 cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: API_KEY, 
    api_secret: API_SECRET // Click 'View Credentials' below to copy your API secret
});

const blogController={
    async create(req,res,next){
         // 1. validate req body
         // 2. handle photo storage, naming
         // 3. add to db
         // 4. return response

         // client side -> base64 encoded string -> decode -> store -> save photo's path in db

        const createBlogSchema=Joi.object({
            title:Joi.string().required(),
            author:Joi.string().regex(mongodbIdPattern).required(),
            content:Joi.string().required(),
            photo:Joi.string().required(),
        })

        const {error}=createBlogSchema.validate(req.body);

        // if statement check any error, error yes then throw error      
        if (error) {
            return next(error)
        }
        const {title,author,content,photo}=req.body;  //de-structure is come from req.body

        // read as buffer
        // const buffer = Buffer.from(
        //       photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        //       "base64"
        //     );

            //allot a random name
            // const imagePath=`${Date.now()}-${author}.png`
//save to cloudinary
                let response;
            try {
               response=await cloudinary.uploader.upload(photo)
                //fs.writeFileSync(`storage/${imagePath}`,buffer) //We get fs functionality this from the node side
            } catch (error) {
                return next(error)
            }

            //save blog in db
            let newBlog
            try {
                newBlog=new Blog({
                    title,
                    author,
                    content,
                    //photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`, //BACKEND_SERVER_PATH is coming from env config.env file
                    photoPath: response.url,
                })
                await newBlog.save() //save the blog in database
            } catch (error) {
                return next(error)
            }
            const blogDto=new BlogDTO(newBlog); //BlogDTO is comming from dto folder file name blog.js

          return res.status(201).json({blog:blogDto})
    },
    async getAll(req,res,next){
        try { 
            const blogs=await Blog.find({});
            const blogsDto=[];
            for (let i = 0; i < blogs.length; i++) {
                const dto =new BlogDTO(blogs[i]);
                blogsDto.push(dto)                
            }
            return res.status(200).json({blogs:blogsDto})
        } catch (error) {
            return next(error)
        }
    },
    async getById(req,res,next){
        //validate id
        //response

        const getByIdSchema=Joi.object({
            id:Joi.string().regex(mongodbIdPattern).required()
        });

        const{error}=getByIdSchema.validate(req.params)

        if (error) {
            return next(error)
        }

        let blog;
        const {id}=req.params;

        try {
            blog=await Blog.findOne({_id:id}).populate("author")         
        } catch (error) {
            return next(error)
        }

        const blogDto=new BlogDetailsDTO(blog);

        return res.status(200).json({blog:blogDto})
    },
    async update(req,res,next){
        //validate
        const updateBlogSchema=Joi.object({
            title:Joi.string().required(),
            content:Joi.string().required(),
            author:Joi.string().regex(mongodbIdPattern).required(),
            blogId:Joi.string().regex(mongodbIdPattern).required(),
            photo:Joi.string()
        })
        const {error}=updateBlogSchema.validate(req.body);

        const {title,content,author,blogId,photo}=req.body

        //delete previous photo
        //save new photo

        let blog;
        try {
            blog=await Blog.findOne({_id:blogId})

        } catch (error) {
            return next(error)
        }

        if (photo) {
            let previousPhoto=blog.photoPath;

            previousPhoto=previousPhoto.split("/").at(-1);

            //delete photo
            fs.unlinkSync(`storage/${previousPhoto}`)

            //new photo update

                // read as buffer
        // const buffer = Buffer.from(
        //     photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        //     "base64"
        //   );

          //allot a random name
        //   const imagePath=`${Date.now()}-${author}.png`
        let response;

          try {
            response =await cloudinary.uploader.upload(photo)
             // fs.writeFileSync(`storage/${imagePath}`,buffer) //We get fs functionality this from the node side
          } catch (error) {
              return next(error)
          }

          await Blog.updateOne({_id:blogId},
            {title,
            content,
            // photoPath:`${BACKEND_SERVER_PATH}/storage/${imagePath}`
            photoPath:response.url,
        }
          )

        }
        else{
            await Blog.updateOne({_id:blogId},
                {title,content}
            )
        }
        return res.status(200).json({message:"Blog Updated"})
    },
    async delete(req,res,next){
        // validate id
        // delete blog
        // delete comments on this blog

        const deleteBlogSchema=Joi.object({
            id:Joi.string().regex(mongodbIdPattern).required()
        });

        const {error}=deleteBlogSchema.validate(req.params);
        const {id}=req.params;

        // delete blog
        // delete comments
        try {
            await Blog.deleteOne({_id:id});
            await Comment.deleteMany({blog:id})

        } catch (error) {
            return next(error)
        }
        return res.status(200).json({message:"Blog deleted"})
    },
}

module.exports=blogController

