//#include <mongols/tcp_server.hpp>
//#include <mongols/tcp_threading_server.hpp>
//#include <mongols/http_server.hpp>
#include <mongols/ws_server.hpp>
#include <unistd.h>
#include <fstream>
#include "mongols/lib/json11.hpp"


#define PID_FILE                "fusheng.pid"
#define CONFIG_FILE             "config.json"

int main(int, char**) {
    daemon(1, 0);
    std::string line, config_json, err;
    std::ifstream f(CONFIG_FILE);

    if (f.is_open()) {
        while (std::getline(f, line)) {
            config_json.append(line);
        }

        f.close();

        json11::Json config = json11::Json::parse(config_json, err);
        if (err.empty()) {
            std::string host;
            int port, timeout, buffer_size;
            host = config["host"].string_value();
            port = config["port"].int_value();
            timeout = config["timeout"].int_value();
            buffer_size = config["buffer_size"].int_value();
            mongols::ws_server server(host, port, timeout, buffer_size);
            {
                std::ofstream pid_file(PID_FILE);
                pid_file << getpid();
            }
            server.run();
            remove(PID_FILE);
        }
    }



    //    int port = 9999;
    //    const char* host = "127.0.0.1";
    //    mongols::ws_server server(host, port);
    //    	auto f=[](const std::string& input
    //                , bool& keepalive
    //                , bool& send_to_other
    //                , std::pair<size_t, size_t>& g_u_id
    //                , mongols::tcp_server::filter_handler_function& send_to_other_filter){
    //    			keepalive = KEEPALIVE_CONNECTION;
    //    			send_to_other=true;
    //    			return input;
    //    	};
    //    server.run(f);

}


/*
int main(int,char**)
{
        auto f=[](const std::string& input
                , bool& send_to_other
                , std::pair<size_t, size_t>& g_u_id
                , mongols::tcp_server::filter_handler_function& send_to_other_filter){
                                        send_to_other=true;
                                        return std::make_pair(input,KEEPALIVE_CONNECTION);
                                };
        int port=9999;
        const char* host="127.0.0.1";
	
        mongols::tcp_threading_server
        //mongols::tcp_server

        server(host,port);
        server.run(f);

}
 */


/*
int main(int,char**)
{
        auto f=[](const mongols::request&){
                return true;
        };
        auto g=[](const mongols::request& req,mongols::response& res){
                res.content=std::move("hello,world");
                res.status=200;
        };
        int port=9999;
        const char* host="127.0.0.1";
        mongols::http_server server(host,port);
        server.run(f,g);
}
 */







