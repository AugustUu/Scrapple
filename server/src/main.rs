use server::Server;
use ws::listen;
mod server;
fn main() {
    if let Err(error) = listen("127.0.0.1:3012", |out| Server { out, ping_timeout: None }) {
        println!("Failed to create WebSocket due to {:?}", error);
    }
}
