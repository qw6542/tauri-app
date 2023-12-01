// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]



use tauri_app::handlers::*;
use migration::migrate;



#[tokio::main]
async fn main() {
    migrate().await;
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_post, get_post, update_post, delete_post, list_posts_in_page])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
