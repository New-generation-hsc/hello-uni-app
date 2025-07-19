// 照片信息
interface Photo {
    photo_id : string; // 照片的唯一id
    photo_url : string; // 照片链接
    create_time : number; // 创建时间
}

// 姿势分类
interface Category {
    category_id : string; // 分类id
    name : string; // 分类名称
    create_time : number; // 创建时间
}

// 姿势信息
interface Pose {
    pose_id : string; // 姿势的唯一id
    name : string; // 姿势名称
    desc : string; // 姿势的描述
    categories : Category[]; // 姿势的分类
    create_time : number; // 创建时间
}

// 打卡照片
interface CheckPhoto {
    check_id : string; // 打卡的唯一id
    pose_id : string; // 打卡的姿势id
    create_time : number; // 创建时间
    create_ds : number; // 创建的日期
}

// LikePose
interface LikePose {
    pose_id : string; // 姿势的唯一id
    create_time : number; // 创建时间
}

// 用户喜欢的姿势
interface UserLikePose {
    like_list : LikePose[]; // 用户的喜欢列表
}

interface UserCheckPhoto {
    check_list : CheckPhoto[]; // 打卡记录
}