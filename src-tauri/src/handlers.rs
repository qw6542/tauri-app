use sea_orm::{Set, ActiveModelTrait, Database, DbConn, EntityTrait, QueryOrder, PaginatorTrait};
use entity::{post, post::Entity as Post};
use dotenv::dotenv;

pub async fn establish_connection() -> Result<DbConn, String> {
    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");

    match Database::connect(&database_url).await {
        Ok(db) => Ok(db),
        Err(db_err) => {
            // Handle the DbErr here, you can log it or take appropriate action
            eprintln!("Failed to setup the database: {:?}", db_err);
            Err("Failed to create post".to_string())
        }
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn greet(msg: &str) -> String {
    println!("Received request msg: {msg}");
    format!("Hello, {}! You've been greeted from Rust!", msg)
}

#[tauri::command]
pub async fn create_post(title: String, text: String,) -> Result<String, ()> {
    let db: sea_orm::prelude::DatabaseConnection = establish_connection().await.unwrap();
    let post: post::ActiveModel = post::ActiveModel {
        title: Set(String::from(title)),
        text: Set(String::from(text)),
        ..Default::default()
    };

    let post = post.insert(&db).await.unwrap();
    Ok(serde_json::to_string(&post).unwrap())       
}


#[tauri::command]
pub async fn get_post(id: i32) -> Result<String, ()> {
    println!("Enter get_post api form_data: id: {id}");
    let db: sea_orm::prelude::DatabaseConnection = establish_connection().await.unwrap();
    let optional_post: Option<post::Model> = Post::find_by_id(id)
    .one(&db)
    .await
    .unwrap();

    match optional_post {
     Some(post) => {
        let serialized: String = serde_json::to_string(&post).unwrap();
        Ok(serialized)
    }
    None => {
        eprintln!("No post found id:{id}");
        Err(())
    }
}

}

#[tauri::command]
pub async fn update_post(id: i32,title: String,text: String,) -> Result<String, ()> {
    println!("Enter update_post api form_data: id: {id}, title: {title}, text: {text}");
    let db: sea_orm::prelude::DatabaseConnection = establish_connection().await.unwrap();
    let optional_post: Option<post::Model> = Post::find_by_id(id)
    .one(&db)
    .await
    .unwrap();

    match optional_post {
     Some(post) => {

        let post: post::Model = post::ActiveModel {
            id: Set(post.id),
            title: Set(title.to_owned()),
            text: Set(text.to_owned()),
        }
        .update(&db)
        .await
        .unwrap();
        let serialized: String = serde_json::to_string(&post).unwrap();
        Ok(serialized)
    }
    None => {
        eprintln!("No post found to update id:{id}");
        Err(())
    }
}

}


#[tauri::command]
pub async fn delete_post(id: i32) -> Result<String, ()> {
    println!("Enter update_post api form_data: id: {id}");
    let db: sea_orm::prelude::DatabaseConnection = establish_connection().await.unwrap();
 
    let optional_post: Option<post::Model> = Post::find_by_id(id)
    .one(&db)
    .await
    .unwrap();

    match optional_post {
     Some(post) => {    
        let post_deleted = Post::delete_by_id(post.id).exec(&db).await.unwrap();
        println!("Post deleted id:{id}");

        let serialized: String = serde_json::to_string(&post_deleted.rows_affected).unwrap();
        Ok(serialized)
    }
    None => {
        eprintln!("No post found to delete id:{id}");
        Err(())
    }
}

}


#[tauri::command]
pub async fn list_posts_in_page(page: u64, page_size: u64,) -> Result<String,()> {
    println!("Received request page: {page}, page_size: {page_size}");

    let db: sea_orm::prelude::DatabaseConnection = establish_connection().await.unwrap();
    let paginator = Post::find()
    .order_by_asc(post::Column::Id)
    .paginate(&db, page_size);

    let posts = paginator.fetch_page(page).await.unwrap();

    Ok(serde_json::to_string(&posts).unwrap())
}