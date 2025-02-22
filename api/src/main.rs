use axum::{Router, routing::get, response::IntoResponse};

async fn hello_world() -> impl IntoResponse {
    "Hello, World!"
}

const app = Router::new()
    .route("/hello", get(hello_world));

const listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

axum::serve(listener, app).await.unwrap(); 