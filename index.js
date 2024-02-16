const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
.then(()=> console.log("connected to MongoDB...."))
.catch(err=> console.err('COuld not  connec to mongoDB...'))

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'network'],
        required: true,
        lowercase: true
    },
    author: String,
    tags: {
        type: Array,
        // synchornous validator
        validate: {
            validator(v) {
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag'
        }
        // Async Validator
        /*validate: {
            validator: function(v) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const result = v && v.length > 0;
                        resolve(result);
                    }, 1000);
                });
            },
            message: 'A course should have at least one tag'
        }*/
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () { return this.isPublished; },
        min: 10,
        max: 200,
        get: v=>Math.round(v),
        set: v=> Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    const course = new Course({
        name : '.NET Course',
        category: 'Web',
        author : 'Mosh',
        tags: ['frontend'], 
        isPublished: true,
        price: 15.8
        
    });
    
    try{
        const result = await course.save();
        console.log(result);
    }
    catch(ex){
        for(let field in ex.errors)
        console.log(ex.errors[field]);
    }
    
}


async function getCourses(){
    const courses = await Course
    .find({_id:'65cc5d00e2ad1f1b10f64580'})
    // .find({price:{$gte:10,$lte:20}})
    // .find({ price:{ $in:[10,15,20] } })
    // .limit(10)
    .sort({name:1})
    .select({name: 1, tag:1, price:1});
    console.log(courses[0].price);
}

async function updateCourse(id){
    const course = await Course.findById(id);
    if(!course) return;
    course.isPublished = true;
    course.author = "Kundan";
    // course.set({
    //     isPublished:true,
    //     author:"Kundan"
    // })
    const result = await course.save();
    console.log(result);
}

// updateCourse("65c5ced6f8bacb6c89b01ca5");

async function updateFirstCourse(id){
    const course = await Course.findByIdAndUpdate(id,{
        $set:{
            author : "Jack",
            isPublished : true
        }
    });
    console.log(course);
}

// updateFirstCourse("65c5ced6f8bacb6c89b01ca5");

async function removeCourse(id){
    // const result = await Course.deleteOne({_id:id});
    const course = await Course.findByIdAndDelete(id);
    console.log(course);
}

// removeCourse("65c5ced6f8bacb6c89b01ca5");

getCourses();