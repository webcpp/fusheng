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
}

