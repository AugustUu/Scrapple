use serde::{Deserialize, Serialize};
use ws::{*,util::Timeout};

pub struct Server {
    pub out: Sender,
    pub ping_timeout: Option<Timeout>,

}

//#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u8,
    phones: Vec<String>,
}

impl Handler for Server {
    fn on_open(&mut self, handshake: Handshake) -> Result<()> {
        if let Some(peer_addr) = handshake.peer_addr{
            println!("New Client Connected {}", peer_addr);
        }
        Ok(())
    }
    
    fn on_shutdown(&mut self) {
    }
    
    fn on_message(&mut self, msg: Message) -> Result<()> {
        println!("Server got message '{}'. ", msg);
        //let testing:Test =  serde_json::from_str(msg.as_text().unwrap()).unwrap();
        self.out.send(format!("client said {}",msg))
    }

    fn on_close(&mut self, code: CloseCode, reason: &str) {

    }
    
    fn on_request(&mut self, req: &Request) -> Result<Response> {
        Response::from_request(req)
    }
    
    fn on_response(&mut self, res: &Response) -> Result<()> {
        Ok(())
    }
    
    fn on_timeout(&mut self, event: util::Token) -> Result<()> {        
        Ok(())
    }
    
    fn on_new_timeout(&mut self, _: util::Token, _: Timeout) -> Result<()> {
        Ok(())
    }
    
    fn on_frame(&mut self, frame: Frame) -> Result<Option<Frame>> {
        Ok(Some(frame))
    }
    
    
}