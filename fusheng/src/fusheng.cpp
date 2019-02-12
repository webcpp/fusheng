#include <mongols/ws_server.hpp>
#include <mongols/util.hpp>
#include <mongols/lib/json11.hpp>
#include <unistd.h>
#include <fstream>
#include <thread>


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

            mongols::tcp_server::max_connection_limit = config["max_connection_limit"].int_value();
            mongols::tcp_server::max_send_limit = config["max_send_limit"].int_value();


            mongols::ws_server server(host, port, timeout, buffer_size, std::thread::hardware_concurrency());

            server.set_enable_blacklist(config["enable_blacklist"].bool_value());
            server.set_enable_origin_check(config["enable_origin_check"].bool_value());
            server.set_origin(config["origin"].string_value());
            server.set_enable_security_check(config["enable_security_check"].bool_value());

            if (config["openssl"]["enable"].bool_value()) {
                if (!server.set_openssl(config["openssl"]["crt"].string_value(), config["openssl"]["crt"].string_value())) {
                    return -1;
                }
            }
            {
                std::ofstream pid_file(PID_FILE);
                pid_file << getpid();
            }

            std::function<void(pthread_mutex_t*, size_t*) > ff = [&](pthread_mutex_t* mtx, size_t * data) {
                server.run();
            };

            std::function<bool(int) > g = [&](int status) {
                //                std::cout << strsignal(WTERMSIG(status)) << std::endl;
                return false;
            };

            mongols::multi_process main_process;
            main_process.run(ff, g, config["worker"].int_value());


            remove(PID_FILE);
        }
    }
}

